import axios from 'axios';

import {
  API_ENDPOINTS,
  TRASHPOINT_IMAGE_TYPES,
} from '../../shared/constants';
import {
  convertToByteArray,
  getDistanceBetweenPointsInMeters,
  getGridValue,
  destinationPoint,
} from '../../shared/helpers';
import { ApiService } from '../../services';
import { BASE_URL } from '../../services/Api';
import selectors from './selectors';
import { actions as appActions, selectors as appSelectors } from '../app';
import { actions as errorActions } from '../error';

import TYPES from './types';

const setGridValue = gridValue => ({ type: TYPES.SET_GRID_VALUE, gridValue });

export const fetchAreaTrashpoints = ({
  areaId,
  pageSize,
  pageNumber,
  reset,
}) => async dispatch => {
  try {
    const response = await ApiService.get(
      `${API_ENDPOINTS.FETCH_AREA_TRASHPOINTS(
        areaId,
      )}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
    if (!response || !response.data || !Array.isArray(response.data.records)) {
      const response = await ApiService.get(
        `${API_ENDPOINTS.FETCH_AREA_TRASHPOINTS(
          areaId,
        )}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      );
      if (!response) {
        dispatch({
          type: TYPES.FETCH_AREA_MARKERS_ERROR,
        });
        dispatch(errorActions.setErrorMessage('Failed to load trashpoints'));
        return false;
      }
    }

    const total = response.data.total || 0;
    const canLoadMore = total > pageNumber * pageSize;

    dispatch({
      type: TYPES.FETCH_AREA_MARKERS_SUCESS,
      payload: {
        reset,
        markers: response.data.records.map(marker => ({
          ...marker,
          position: {
            lat: marker.location.latitude,
            lng: marker.location.longitude,
          },
          key: marker.id,
          isTrashpile: true,
        })),
        areaId,
        canLoadMore,
        statusCounts: response.data.statusCounts,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load trashpoints'));
    return false;
  }
};

const fetchAllMarkers = (
  viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  mapSize,
) => async (dispatch, getState) => {
  try {
    dispatch({ type: TYPES.FETCH_ALL_MARKERS_REQUEST });
    let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());

    if (!datasetId) {
      try {
        await dispatch(appActions.fetchDatasets());
        datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
      } catch (ex) {
        dispatch(errorActions.setErrorMessage('Failed to load trashpoint markers'));
        dispatch({ type: TYPES.FETCH_ALL_MARKERS_FAILED });
      }
    }

    const diagonaleInMeters = getDistanceBetweenPointsInMeters(
      viewPortLeftTopCoordinate.latitude,
      viewPortLeftTopCoordinate.longitude,
      viewPortRightBottomCoordinate.latitude,
      viewPortRightBottomCoordinate.longitude,
    );
    const grid = getGridValue(diagonaleInMeters);
    dispatch(setGridValue(grid));
    let cellSize = 0;
    if (
      viewPortRightBottomCoordinate.longitude >
      viewPortLeftTopCoordinate.longitude
    ) {
      cellSize =
        38 *
        (viewPortRightBottomCoordinate.longitude -
          viewPortLeftTopCoordinate.longitude) /
        mapSize.width;
    } else {
      cellSize =
        (180 -
          viewPortLeftTopCoordinate.longitude +
          viewPortRightBottomCoordinate.longitude +
          180) *
        38 /
        mapSize.width;
    }

    const body = {
      datasetId,
      rectangle: {
        nw: viewPortLeftTopCoordinate,
        se: viewPortRightBottomCoordinate,
      },
      cellSize,
    };

    const [clustersRes] = await Promise.all([
      ApiService.post(
        API_ENDPOINTS.FETCH_OVERVIEW_CLUSTERS,
        {
          ...body,
        },
        {
          withToken: false,
        },
      ),
    ]);

    let markers = [];

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
          id: cluster.id,
        })),
      ];
    }

    try {
      if (!clustersRes.data.length) {
        dispatch(appActions.showExpandAreaModal());
      }
    } catch (e) {
      console.error(e);
    }

    if (!clustersRes) {
      dispatch(errorActions.setErrorMessage('Failed to load trashpoint markers'));
      return dispatch({ type: TYPES.FETCH_ALL_MARKERS_FAILED });
    }

    dispatch({
      type: TYPES.FETCH_ALL_MARKERS_SUCCESS,
      markers,
    });
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load trashpoint markers'));
  }
};

const fetchTrashTypesAndOrigin = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TYPES.FETCH_TRASH_TYPES_ORIGIN });
    const response = await ApiService.get(
      API_ENDPOINTS.FETCH_TRASH_TYPES_ORIGIN,
    );
    if (!response) {
      return dispatch({ type: TYPES.FETCH_TRASH_TYPES_ORIGIN_FAILED });
    }
    dispatch({
      type: TYPES.FETCH_TRASH_TYPES_ORIGIN_SUCCESS,
      trashTypes: response.data.trashpointCompositions,
      trashOrigin: response.data.trashpointOrigins,
    });
  } catch (e) {
    console.log(e);
  }
};

const fetchClusterTrashpoints = ({
  cellSize,
  coordinates,
  clusterId,
}) => async (dispatch, getState) => {
  try {
    let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    const markers = selectors.getAllMarkers(getState());

    if (!datasetId) {
      try {
        await dispatch(appActions.fetchDatasets());
        datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
      } catch (ex) {
        return dispatch({ type: TYPES.FETCH_ALL_MARKERS_FAILED });
      }
    }

    const body = {
      datasetId,
      cellSize,
      coordinates,
    };
    const response = await ApiService.post(
      API_ENDPOINTS.FETCH_CLUSTER_TRASHPOINTS,
      body,
    );

    if (response && response.data && Array.isArray(response.data)) {
      const angleBetweenPoints = 360 / response.data.length;
      dispatch({
        type: TYPES.FETCH_ALL_MARKERS_SUCCESS,
        markers: [
          ...markers.filter(({ id }) => id !== clusterId),
          ...response.data.map((marker, index) => ({
            ...marker,
            position: destinationPoint(
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
    console.log(e);
  }
};

export const fetchAdminTrashpoints = (
  pageSize,
  pageNumber,
) => async dispatch => {
  dispatch({ type: TYPES.FETCH_ADMIN_TRASHPOINTS_REQUEST });
  try {
    const response = await ApiService.get(
      `${API_ENDPOINTS.FETCH_ADMIN_TRASHPOINTS}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
    if (!response) {
      dispatch(errorActions.setErrorMessage('Failed to load area trashpoints'));
      return dispatch({
        type: TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED,
      });
    }

    const adminTrashpoints =
      response.data && Array.isArray(response.data.records)
        ? response.data.records.map(marker => ({
          ...marker,
          position: {
            lat: marker.location.latitude,
            lng: marker.location.longitude,
          },
          key: marker.id,
          isTrashpile: true,
        }))
        : [];

    dispatch({
      type: TYPES.FETCH_ADMIN_TRASHPOINTS_SUCCESS,
      adminTrashpoints,
      pageSize,
      pageNumber,
      canLoadMore: adminTrashpoints.length > 0,
    });
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load area trashpoints'));
    dispatch({
      type: TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED,
      payload: e,
    });
  }
};

export const resetAdminTrashpoints = () => ({
  type: TYPES.RESET_ADMIN_TRASHPOINTS,
});

const toggleDetailsWindow = () => ({
  type: TYPES.TOGGLE_TP_DETAILS_WINDOW,
});

const fetchMarkerDetails = (markerId, mapFocusNeeded) => async dispatch => {
  try {
    dispatch({ type: TYPES.FETCH_MARKER_DETAILS_REQUEST });
    const [imagesResponse, detailsResponse] = await Promise.all([
      ApiService.get(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
        withToken: false,
      }),
      ApiService.get(API_ENDPOINTS.FETCH_TRASHPOINT_DETAILS(markerId), {
        withToken: false,
      }),
    ]);

    if (!imagesResponse || !detailsResponse) {
      dispatch(errorActions.setErrorMessage('Failed to load trashpoint details'));
      dispatch({ type: TYPES.FETCH_MARKER_DETAILS_FAILED });
    }

    const imageResponseIsArray = Array.isArray(imagesResponse.data);
    const photos = imageResponseIsArray ? imagesResponse.data : [];
    const thumbnails = imageResponseIsArray
      ? photos.filter(({ type }) => type === TRASHPOINT_IMAGE_TYPES.THUMBNAIL)
      : [];
    const mediumPhotos = imageResponseIsArray
      ? photos.filter(({ type }) => type === TRASHPOINT_IMAGE_TYPES.MEDIUM)
      : [];
    const marker = {
      ...detailsResponse.data,
      position: {
        lat: detailsResponse.data.location.latitude,
        lng: detailsResponse.data.location.longitude,
      },
      photos,
      thumbnails,
      mediumPhotos,
    };

    dispatch({
      type: TYPES.FETCH_MARKER_DETAILS_SUCCESS,
      marker,
    });
    dispatch(
      appActions.setChosenMarkerCoordinates({
        ...detailsResponse.data.location,
        mapFocusNeeded,
      }),
    );
    return marker;
  } catch (e) {
    dispatch(errorActions.setErrorMessage('Failed to load trashpoint details'));
  }
};

export const deleteImage = (markerId, imageId) =>
  ApiService.delete(API_ENDPOINTS.DELETE_IMAGE(markerId, imageId));

export const getUploadURIsForPhotos = (photos, markerId) =>
  ApiService.put(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
    count: photos.length,
  });

export const uploadPhotosOnAzure = photos =>
  Promise.all(
    photos.map(({ url, blob }) =>
      axios
        .put(url, blob, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
          },
        })
        .catch(res => res),
    ),
  );

export const confirmUploadedPhotos = (trashpointId, uploadedPhotos) => {
  const url = API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(trashpointId);
  const promise = ApiService.post(url, uploadedPhotos);
  return promise;
};

export const handleUpload = async ({ photos, markerId }) => {
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
  }

  return (
    uploadedPhotosIds.confirmed.length > 0 &&
    uploadedPhotosIds.failed.length === 0 &&
    uploadedPhotosIds.backendConfirmed
  );
};

export const createMarker = (
  {
    id,
    hashtags,
    composition,
    origin,
    location,
    status,
    name,
    address,
    amount,
    photos,
  },
  isEdit,
) => async (dispatch, getState) => {
  try {
    dispatch({ type: TYPES.CREATE_MARKER_REQUEST });
    const newMarker = origin.length ? {
      hashtags,
      composition,
      origin,
      location,
      status,
      name,
      address,
      amount,
    } :
    {
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
      newMarker.datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    } else {
      newPhotos = photos.filter(({ id }) => id === undefined);
      toDeletePhotos = photos.filter(
        p => p.id !== undefined && p.delete === true && !!p.parentId,
      );
    }
    const url = isEdit
      ? API_ENDPOINTS.UPDATE_TRASHPOINT(id)
      : API_ENDPOINTS.CREATE_TRASHPOINT;

    const createMarkerResponse = await ApiService.put(url, newMarker);

    if (!createMarkerResponse) {
      dispatch({ type: TYPES.CREATE_MARKER_FAILED });
      return dispatch(errorActions.setErrorMessage('Failed placing trashpoint'));
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
        await Promise.all(toDeletePhotos.map(p => deleteImage(id, p.parentId)));
      } catch (ex) {
        console.log(ex);
        dispatch(errorActions.setErrorMessage('Failed to delete photos'));
      }
    }

    if (!isEdit) {
      uploadStatus = await handleUpload({
        photos,
        markerId: createMarkerResponse.data.id,
      });
    }

    dispatch({
      type: TYPES.CREATE_MARKER_SUCCESS,
      marker: {
        ...createMarkerResponse.data,
        latlng: {
          latitude: createMarkerResponse.data.location.latitude,
          longitude: createMarkerResponse.data.location.longitude,
        },
        position: {
          lat: createMarkerResponse.data.location.latitude,
          lng: createMarkerResponse.data.location.longitude,
        },
      },
    });
    return {
      ...createMarkerResponse.data,
      photoStatus: uploadStatus,
    };
  } catch (ex) {
    dispatch({ type: TYPES.CREATE_MARKER_FAILED });
    dispatch(errorActions.setErrorMessage('Failed placing trashpoint'));
  }
};

const focusMapLocation = location => ({
  type: TYPES.FOCUS_MAP_LOCATION,
  payload: {
    location,
  },
});

const deleteMarker = ({ markerId }) => async dispatch => {
  dispatch({ type: TYPES.DELETE_MARKER });
  const response = await ApiService.delete(`/trashpoints/${markerId}`, {
    skipError: false,
  });
  if (!response || !response.status || response.status !== 200) {
    dispatch({ type: TYPES.DELETE_MARKER_ERROR });
    dispatch(errorActions.setErrorMessage('Failed to delete trashpoint'));
    return false;
  }
  dispatch({ type: TYPES.DELETE_MARKER_SUCCESS, payload: { markerId } });
  return true;
};

const resetAreaTrashpoints = () => ({ type: TYPES.RESET_AREA_TRASHPOINTS });

export default {
  fetchAllMarkers,
  fetchClusterTrashpoints,
  fetchAdminTrashpoints,
  fetchTrashTypesAndOrigin,
  toggleDetailsWindow,
  fetchMarkerDetails,
  deleteImage,
  resetAdminTrashpoints,
  createMarker,
  handleUpload,
  focusMapLocation,
  fetchAreaTrashpoints,
  resetAreaTrashpoints,
  deleteMarker,
};
