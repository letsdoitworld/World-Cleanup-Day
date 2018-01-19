import { ImageStore, PixelRatio } from 'react-native';
import { FileSystem } from 'expo';
import { API_ENDPOINTS, TRASHPOINT_IMAGE_TYPES, DIAGONALE_IN_PX, MARKER_DIAGONALE_IN_PX, MIN_ZOOM,
DEFAULT_ZOOM, SCREEN_WIDTH} from '../../shared/constants';
import types from './types';
import { Api } from '../../services';
import axios from 'axios';
import { selectors as appSelectors, operations as appOps } from '../app';
import { selectors as trashpileSelectors } from '../trashpile';
import {
  convertToByteArray,
  guid,
  destinationPoint,
  handleSentryError
} from '../../shared/helpers';

import actions from './actions';
import selectors from './selectors';



const fetchAllMarkers = (viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  delta
) => {
  return async (dispatch, getState) => {
    dispatch({ type: types.FETCH_ALL_MARKERS_REQUEST });
    let datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
    if (!datasetId) {
      try {
        await dispatch(appOps.fetchDatasets());
        datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
      } catch (ex) {
        return dispatch({ type: types.FETCH_ALL_MARKERS_FAILED });
      }
    }

    let cellSize = 0;
    if (viewPortRightBottomCoordinate.longitude > viewPortLeftTopCoordinate.longitude) {
      cellSize = 28 * (viewPortRightBottomCoordinate.longitude - viewPortLeftTopCoordinate.longitude) /  SCREEN_WIDTH;
    } else {
      cellSize =(180 - viewPortLeftTopCoordinate.longitude + viewPortRightBottomCoordinate.longitude + 180) * 28 /  SCREEN_WIDTH;
    }
    const latitudeDelta = delta.latitudeDelta / 3;
    const longitudeDelta = delta.latitudeDelta / 3;
    const newDelta = {
      latitudeDelta: latitudeDelta < MIN_ZOOM ? MIN_ZOOM : latitudeDelta,
      longitudeDelta: longitudeDelta < MIN_ZOOM ? MIN_ZOOM : longitudeDelta,
      cellSize
    };
    dispatch(actions.setLastDelta(newDelta));
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
      Api.post(API_ENDPOINTS.FETCH_OVERVIEW_CLUSTERS, body, {
        withToken: false,
      }),
    ]);

    let markers = [];

    if (markersRes && markersRes.data && Array.isArray(markersRes.data)) {
      markers = [
        ...markersRes.data.map(marker => ({
          ...marker,
          latlng: marker.location,
          isTrashpile: true,
        })),
      ];
    }

    if (clustersRes && clustersRes.data && Array.isArray(clustersRes.data)) {
      markers = [
        ...markers,
        ...clustersRes.data.map(cluster => ({
          ...cluster,
          latlng: cluster.location,
          isTrashpile: true,
          id: guid(),
        })),
      ];
    }

    if (!markersRes) {
      return dispatch({ type: types.FETCH_ALL_MARKERS_FAILED });
    }

    dispatch({
      type: types.FETCH_ALL_MARKERS_SUCCESS,
      markers,
    });
  };
};

const fetchClusterTrashpoints = ({ cellSize, coordinates, clusterId }) => {
  return async (dispatch, getState) => {
    try {
      let datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
      if (!datasetId) {
        try {
          await dispatch(appOps.fetchDatasets());
          datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
        } catch (ex) {
          return dispatch({ type: types.FETCH_ALL_MARKERS_FAILED });
        }
      }
      const markers = trashpileSelectors.markersSelector(getState());

      const body = {
        datasetId,
        cellSize,
        coordinates,
      };
      const response = await Api.post(
        API_ENDPOINTS.FETCH_CLUSTER_TRASHPOINTS,
        body,
      );

      if (response && response.data && Array.isArray(response.data)) {
        const angleBetweenPoints = 360 / response.data.length;
        dispatch({
          type: types.FETCH_ALL_MARKERS_SUCCESS,
          markers: [
            ...markers.filter(({ id }) => id !== clusterId),
            ...response.data.map((marker, index) => ({
              ...marker,
              latlng: destinationPoint(
                marker.location,
                3,
                index * angleBetweenPoints,
              ),
              isTrashpile: true,
            })),
          ],
        });
      }
    } catch (e) {
      handleSentryError(e);
      console.log(e);
    }
  };
};

const fetchMarkerDetails = (markerId) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_MARKER_DETAILS_REQUEST });
    const [imagesResponse, detailsResponse] = await Promise.all([
      Api.get(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
        withToken: false,
      }),
      Api.get(API_ENDPOINTS.FETCH_TRASHPOINT_DETAILS(markerId), {
        withToken: false,
      }),
    ]);

    if (!imagesResponse || !detailsResponse) {
      return dispatch({ type: types.FETCH_MARKER_DETAILS_FAILED });
    }
    dispatch({
      type: types.FETCH_MARKER_DETAILS_SUCCESS,
      marker: {
        ...detailsResponse.data,
        latlng: {
          latitude: detailsResponse.data.location.latitude,
          longitude: detailsResponse.data.location.longitude,
        },
        photos: [...imagesResponse.data],
        thumbnails: [
          ...imagesResponse.data.filter(
            ({ type }) => type === TRASHPOINT_IMAGE_TYPES.THUMBNAIL,
          ),
        ],
        mediumPhotos: [
          ...imagesResponse.data.filter(
            ({ type }) => type === TRASHPOINT_IMAGE_TYPES.MEDIUM,
          ),
        ],
      },
    });
  };
};

export const handleUpload = async ({ photos, markerId }) => {
  if ((photos || []).length === 0) {
    return true;
  }
  const photosResponse = await getUploadURIsForPhotos(photos, markerId);

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

    const mediumPhotos = photosResponse.data
      .filter(pr => pr.type === TRASHPOINT_IMAGE_TYPES.MEDIUM)
      .map(({ permission: { token, resourceId } }, index) => {
        const { base64 } = photos[index];
        return {
          url: token,
          id: resourceId,
          blob: convertToByteArray(base64),
        };
      });

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

  await Promise.all(
    photos.map((photo) => {
      return FileSystem.deleteAsync(photo.uri, {
        idempotent: true,
      });
    }),
  );

  return (
    uploadedPhotosIds.confirmed.length > 0 &&
    uploadedPhotosIds.failed.length === 0 &&
    uploadedPhotosIds.backendConfirmed
  );
};

export const createMarker = ({
    id,
    hashtags,
    composition,
    location,
    status,
    name,
    address,
    amount,
    photos,
  },
  isEdit,) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: types.CREATE_MARKER_REQUEST });
      const newMarker = {
        hashtags,
        composition,
        location,
        status,
        name,
        address,
        amount,
      };
      let newPhotos = [];
      let toDeletePhotos = [];
      if (!isEdit) {
        let datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
        if (!datasetId) {
          try {
            await dispatch(appOps.fetchDatasets());
            datasetId = appSelectors.trashpointsDatasetUUIDSelector(getState());
          } catch (ex) {
            return dispatch({ type: types.FETCH_ALL_MARKERS_FAILED });
          }
        }
        newMarker.datasetId = datasetId;
      } else {
        newPhotos = photos.filter(({ id }) => {
          return id === undefined;
        });
        toDeletePhotos = photos.filter(
          p => p.id !== undefined && p.delete === true && !!p.parentId,
        );
      }
      const url = isEdit
        ? API_ENDPOINTS.UPDATE_TRASHPOINT(id)
        : API_ENDPOINTS.CREATE_TRASHPOINT;

      const createMarkerResponse = await Api.put(url, newMarker);

      if (!createMarkerResponse) {
        dispatch({ type: types.CREATE_MARKER_FAILED });
        return undefined;
      }

      let uploadStatus;

      if (isEdit && newPhotos.length > 0) {
        uploadStatus = await handleUpload({
          photos: newPhotos,
          markerId: createMarkerResponse.data.id,
        });
      }
      if (isEdit && toDeletePhotos.length > 0) {
        try {
          await Promise.all(
            toDeletePhotos.map(p => deleteImage(id, p.parentId)),
          );
        } catch (ex) {
          handleSentryError(ex);
          console.log(ex);
        }
      }

      if (!isEdit) {
        uploadStatus = await handleUpload({
          photos,
          markerId: createMarkerResponse.data.id,
        });
      }
      if (uploadStatus === undefined) {
        uploadStatus = true;
      }

      dispatch({
        type: types.CREATE_MARKER_SUCCESS,
        marker: {
          ...createMarkerResponse.data,
          latlng: {
            latitude: createMarkerResponse.data.location.latitude,
            longitude: createMarkerResponse.data.location.longitude,
          },
        },
      });
      return {
        ...createMarkerResponse.data,
        photoStatus: uploadStatus,
      };
    } catch (ex) {
      handleSentryError(ex);
      dispatch({ type: types.CREATE_MARKER_FAILED });
    }
  };
};

export const deleteImage = (markerId, imageId) => {
  return Api.delete(API_ENDPOINTS.DELETE_IMAGE(markerId, imageId), {
    skipError: false,
  });
};

export const getUploadURIsForPhotos = (photos, markerId) => {
  return Api.put(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
    count: photos.length,
  });
};

export const uploadPhotosOnAzure = (photos) => {
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
            handleSentryError(res);
            return res;
          });
        });
      });
    }),
  );
};

export const confirmUploadedPhotos = (trashpointId, uploadedPhotos) => {
  const url = API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(trashpointId);
  const promise = Api.post(url, uploadedPhotos);
  return promise;
};

export const fetchUserTrashpoints = ({ reset = false } = {}) => async (dispatch,
  getState,) => {
  dispatch(actions.fetchUserTrashpoints({ reset }));

  const state = getState();

  const pageNumber = selectors.userTrashpointsNextPage(state);
  const pageSize = selectors.userTrashpointsPageSize(state);

  const response = await Api.get(
    API_ENDPOINTS.FETCH_USERS_TRASHPOINTS,
    {
      withToken: true,
    },
    {
      params: {
        pageSize,
        pageNumber: reset ? 1 : pageNumber,
      },
    },
  );
  if (!response) {
    return dispatch(actions.fetchUserTrashpointsError());
  }
  const { records } = response.data;
  dispatch(
    actions.fetchUserTrashpointsSuccess({
      reset,
      trashpoints: records,
      endReached: records.length < pageSize,
    }),
  );
  return response.data;
};

const deleteMarker = ({ markerId }) => async (dispatch) => {
  dispatch(actions.deleteMarker());
  const response = await Api.delete(`/trashpoints/${markerId}`, {
    skipError: false,
  });
  if (!response || !response.status || response.status !== 200) {
    dispatch(actions.deleteMarkerError());
    return false;
  }
  dispatch(actions.deleteMarkerSuccess({ markerId }));
  return true;
};

export default {
  fetchAllMarkers,
  createMarker,
  fetchMarkerDetails,
  fetchUserTrashpoints,
  handleUpload,
  deleteImage,
  fetchClusterTrashpoints,
  deleteMarker,
};
