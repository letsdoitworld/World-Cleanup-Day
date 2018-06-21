import { ImageStore } from 'react-native';
import FileSystem from 'react-native-filesystem';
import axios from 'axios/index';
import Api from '../services/Api';
import {
  API_ENDPOINTS,
  MIN_ZOOM,
  SCREEN_WIDTH,
  TRASHPOINT_IMAGE_TYPES,
} from '../shared/constants';
import { fetchTrashPointsDataSets } from './datasets';
import { destinationPoint, guid, convertToByteArray } from '../shared/helpers';

async function searchTrashPointsRequest(query, page, pageSize, location) {
  try {
    const response = await Api.get('trashpoints',
      {
        params: {
          pageSize,
          pageNumber: page + 1,
          location,
          name: query,
        },
      },
      {
        withToken: true,
      });
    if (!response || !response.data) {
      throw new Error('Could not load trashpoins');
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}
const getUploadURIsForPhotos = (photos, markerId) => {
  return Api.put(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
    count: photos.length,
  });
};

const uploadPhotosOnAzure = (photos) => {
  return Promise.all(
    photos.map(({ url, blob }) => {
      return axios
        .put(url, blob, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
          },
        })
        .catch(() => {
          return axios
            .put(url, blob, {
              headers: {
                'x-ms-blob-type': 'BlockBlob',
              },
            }).catch(() => {
              return axios
                .put(url, blob, {
                  headers: {
                    'x-ms-blob-type': 'BlockBlob',
                  },
                }).catch((res) => {
                  throw res;
                });
            });
        });
    }),
  );
};

const confirmUploadedPhotos = (trashpointId, uploadedPhotos) => {
  const url = API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(trashpointId);
  const promise = Api.post(url, uploadedPhotos);
  return promise;
};
const handleUpload = async ({ photos, markerId }) => {
  if ((photos || []).length === 0) {
    return true;
  }
  const photosResponse = await getUploadURIsForPhotos(photos, markerId)
    .catch((err) => {
      throw err;
    });

  const uploadedPhotosIds = {
    confirmed: [],
    failed: [],
    backendConfirmed: false,
  };

  if (photosResponse) {
    const thumbnailsPhotos = photosResponse.data
      .filter(pr => pr.type === TRASHPOINT_IMAGE_TYPES.THUMBNAIL)
      .map(({ permission: { token, resourceId } }, index) => {
        const { thumbnail: { base64 } } = photos[index];
        return {
          url: token,
          id: resourceId,
          blob: convertToByteArray(base64),
        };
      });

    let mediumPhotos = [];
    try {
      mediumPhotos = photosResponse.data
        .filter(pr => pr.type === TRASHPOINT_IMAGE_TYPES.MEDIUM)
        .map(({ permission: { token, resourceId } }, index) => {
          const { base64 } = photos[index];
          return {
            url: token,
            id: resourceId,
            blob: convertToByteArray(base64),
          };
        });
    } catch (e) {
      throw e;
    }

    const handledPhotos = [...thumbnailsPhotos, ...mediumPhotos];

    const uploadedPhotosResponses = await uploadPhotosOnAzure(handledPhotos);

    if (uploadedPhotosResponses) {
      uploadedPhotosResponses.forEach(({ status }, index) => {
        const state = status === 201 ? 'confirmed' : 'failed';
        uploadedPhotosIds[state].push(handledPhotos[index].id);
      });
      const upRes = await confirmUploadedPhotos(markerId, uploadedPhotosIds);

      if (upRes && upRes.status === 200) {
        uploadedPhotosIds.backendConfirmed = true;
      }
    }
    (thumbnailsPhotos || []).forEach((photo) => {
      if (photo && photo.uri) {
        ImageStore.removeImageForTag(photo.uri);
      }
    });
  }

  return (
    uploadedPhotosIds.confirmed.length > 0 &&
    uploadedPhotosIds.failed.length === 0 &&
    uploadedPhotosIds.backendConfirmed
  );
};
async function createTrashPointRequest(
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
  team,
) {
  try {
    const datasetId = await fetchTrashPointsDataSets()
      .catch((err) => { throw err; });
    const newMarker = {
      hashtags,
      composition,
      location,
      status,
      name,
      address,
      amount,
      datasetId,
      team,
    };

    const url = API_ENDPOINTS.CREATE_TRASHPOINT;

    const createMarkerResponse = await Api.put(url, newMarker)
      .catch((err) => { throw err; });

    let uploadStatus;
    try {
      uploadStatus = await handleUpload({
        photos,
        markerId: createMarkerResponse.data.id,
      });
    } catch (error) {
      throw error;
    }

    return {
      data: {
        trashpoint: { ...createMarkerResponse.data },
        photoStatus: uploadStatus || true,
      },
    };
  } catch (error) {
    throw error;
  }
}

function calculateCell(viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate) {
  let cellSize = 0;
  if (viewPortRightBottomCoordinate.longitude > viewPortLeftTopCoordinate.longitude) {
    cellSize = 28 *
    (viewPortRightBottomCoordinate.longitude - viewPortLeftTopCoordinate.longitude)
    / SCREEN_WIDTH;
  } else {
    cellSize =
    (180 - viewPortLeftTopCoordinate.longitude +
      viewPortRightBottomCoordinate.longitude + 180) * 28 / SCREEN_WIDTH;
  }
  return cellSize;
}

async function fetchAllTrashPointsMarkers(viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  delta,
  datasetId) {
  try {
    const cellSize = calculateCell(
      viewPortLeftTopCoordinate,
      viewPortRightBottomCoordinate,
    );

    const body = {
      datasetId,
      rectangle: {
        nw: viewPortLeftTopCoordinate,
        se: viewPortRightBottomCoordinate,
      },
      cellSize,
    };

    const [markersRes, clustersRes] = await Promise.all([
      Api.post(API_ENDPOINTS.FETCH_OVERVIEW_TRASHPOINTS, body, {
        withToken: false,
      }),
      Api.post(
        API_ENDPOINTS.OVERVIEW_TRASHPOINTS_CLUSTERS,
        {
          ...body,
        },
        {
          withToken: false,
        },
      ),
    ]);

    let markers = [];

    if (markersRes && markersRes.data && Array.isArray(markersRes.data)) {
      markers = [
        ...markersRes.data.map(marker => ({
          ...marker,
          position: {
            lat: marker.location.latitude,
            lng: marker.location.longitude,
          },
          isTrashpile: true,
        })),
      ];
    }

    if (clustersRes && clustersRes.data && Array.isArray(clustersRes.data)) {
      markers = [
        ...markers,
        ...clustersRes.data.map(cluster => ({
          ...cluster,
          position: {
            lat: cluster.location.latitude,
            lng: cluster.location.longitude,
          },
          isTrashpile: true,
          id: guid(),
        })),
      ];
    }
    return markers;
  } catch (ex) {
    throw ex;
  }
}

function calculateDelta(viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  delta) {
  const cellSize = calculateCell(
    viewPortLeftTopCoordinate,
    viewPortRightBottomCoordinate,
  );

  const latitudeDelta = delta.latitudeDelta / 3;
  const longitudeDelta = delta.latitudeDelta / 3;
  const newDelta = {
    latitudeDelta: latitudeDelta < MIN_ZOOM ? MIN_ZOOM : latitudeDelta,
    longitudeDelta: longitudeDelta < MIN_ZOOM ? MIN_ZOOM : longitudeDelta,
    cellSize,
  };
  return newDelta;
}

async function fetchClustersList({
  cellSize,
  coordinates,
  clusterId,
  datasetId,
  markers,
}) {
  try {
    const body = {
      datasetId,
      cellSize,
      coordinates,
    };
    const response = await Api.post(
      API_ENDPOINTS.FETCH_CLUSTER_TRASHPOINTS,
      body,
    );

    let newMarkers = [];
    if (response && response.data && Array.isArray(response.data)) {
      const angleBetweenPoints = 360 / response.data.length;
      newMarkers = [
        ...markers.filter(({ id }) => id !== clusterId),
        ...response.data.map((marker, index) => ({
          ...marker,
          location: destinationPoint(
            marker.location,
            3,
            index * angleBetweenPoints,
          ),
          isTrashpile: true,
        })),
      ];
    }
    return newMarkers;
  } catch (e) {
    throw e;
  }
}

export default {
  searchTrashPointsRequest,
  createTrashPointRequest,
  fetchAllTrashPointsMarkers,
  fetchClustersList,
  calculateDelta,
  calculateCell,
};
