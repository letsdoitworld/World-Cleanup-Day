import axios from "axios/index";
import Api from "../services/Api";
import {API_ENDPOINTS, MIN_ZOOM, SCREEN_WIDTH} from "../shared/constants";
import { datasetUUID } from "../store/selectors";
import { fetchDatasetUIIDAction } from "../store/actions/app";
import { guid, getDistanceBetweenPointsInMeters, getGridValue } from "../shared/helpers";
import types from "../reducers/trashpile/types";

async function loadEvent(id) {
    try {
        const response = await Api.get(`/event/${id}`,
            {
                withToken: true,
            });
        if (!response || !response.data) {
            throw { error: 'Could not load my events' };
        }
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function searchEventsRequest(query, page, pageSize, location) {
    try {
        const response = await Api.get('events',
            {
                params: {
                    pageSize: pageSize,
                    pageNumber: page + 1,
                    location: location,
                    name: query
                },
            },
            {
                withToken: false,
            },);
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response;
    } catch (ex) {
        throw ex
    }
}

// async function loadMapEvents(location, radius) {
//     try {
//         const response = await Api.get(API_ENDPOINTS.FETCH_MAP_EVENTS,
//             {
//                 params: {
//                     location,
//                     radius,
//                 },
//             },);
//         //console.log("==> loadMapEvents ", response.data);
//         return response.data
//     } catch (ex) {
//         //console.log("==> loadMapEvents ex ", ex);
//         throw ex;
//     }
// }

async function fetchAllEventMarkers(
    viewPortLeftTopCoordinate,
    viewPortRightBottomCoordinate,
    delta,
    datasetId) {
    try {

    // dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
    // let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    //
    // if (!datasetId) {
    //     try {
    //         await dispatch(appActions.fetchDatasets());
    //         datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    //     } catch (ex) {
    //         return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
    //     }
    // }

    // const diagonaleInMeters = getDistanceBetweenPointsInMeters(
    //     viewPortLeftTopCoordinate.latitude,
    //     viewPortLeftTopCoordinate.longitude,
    //     viewPortRightBottomCoordinate.latitude,
    //     viewPortRightBottomCoordinate.longitude,
    // );
    // const grid = getGridValue(diagonaleInMeters);
        const cellSize = calculateCell(viewPortLeftTopCoordinate, viewPortRightBottomCoordinate);

   // dispatch(actions.setLastDelta(newDelta));

    const body = {
        datasetId,
        rectangle: {
            nw: viewPortLeftTopCoordinate,
            se: viewPortRightBottomCoordinate,
        },
        cellSize,
    };

    const [markersRes, clustersRes] = await Promise.all([
        Api.post(API_ENDPOINTS.FETCH_EVENTS, body, {
            withToken: false,
        }),
        Api.post(
            API_ENDPOINTS.FETCH_OVERVIEW_EVENT_CLUSTERS,
            {
                ...body,
            },
            {
                withToken: false,
            },
        ),
    ]);

    // const list = await Api.post(API_ENDPOINTS.FETCH_EVENTS, body, {
    //     withToken: false,
    // });

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

    // if (!markersRes && !clustersRes) {
    //     return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
    // }
    //
    // dispatch({
    //     type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
    //     markers,
    // });
    // dispatch({
    //     type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
    //     events: list.data,
    // });
        console.log("fetchAllEventMarkers", markers);
        return markers;
    } catch (ex) {
        throw ex;
    }
};

function calculateCell(viewPortLeftTopCoordinate,
                       viewPortRightBottomCoordinate,) {
    let cellSize = 0;
    if (viewPortRightBottomCoordinate.longitude > viewPortLeftTopCoordinate.longitude) {
        cellSize = 28 * (viewPortRightBottomCoordinate.longitude - viewPortLeftTopCoordinate.longitude) /  SCREEN_WIDTH;
    } else {
        cellSize =(180 - viewPortLeftTopCoordinate.longitude + viewPortRightBottomCoordinate.longitude + 180) * 28 /  SCREEN_WIDTH;
    }
    return cellSize
}

function calculateDelta(viewPortLeftTopCoordinate,
                        viewPortRightBottomCoordinate,
                        delta) {
    const cellSize = calculateCell(viewPortLeftTopCoordinate, viewPortRightBottomCoordinate);

    const latitudeDelta = delta.latitudeDelta / 3;
    const longitudeDelta = delta.latitudeDelta / 3;
    const newDelta = {
        latitudeDelta: latitudeDelta < MIN_ZOOM ? MIN_ZOOM : latitudeDelta,
        longitudeDelta: longitudeDelta < MIN_ZOOM ? MIN_ZOOM : longitudeDelta,
        cellSize
    };
    return newDelta;
}

async function fetchClustersList({
                             cellSize,
                             coordinates,
                             clusterId,
                            datasetId
                         }) {
    try {

        const body = {
            datasetId,
            cellSize,
            coordinates,
        };
        const response = await Api.post( API_ENDPOINTS.FETCH_EVENTS, body, );

        if (response && response.data && Array.isArray(response.data)) {
            const angleBetweenPoints = 360 / response.data.length;
            dispatch({
                type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
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

export default {
  searchEventsRequest,
  loadEvent,
    fetchAllEventMarkers,
    calculateDelta,
};