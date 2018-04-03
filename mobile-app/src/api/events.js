import Api from "../services/Api";
import {API_ENDPOINTS, MIN_ZOOM, SCREEN_WIDTH} from "../shared/constants";
import {destinationPoint, guid} from "../shared/helpers";

async function loadEvent(id) {
    try {
        const response = await Api.get(`/event/${id}`,
            {
                withToken: true,
            });
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function searchEventsRequest(query, page, pageSize, location) {
    try {
        const response = await Api.get('/events',
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
        console.log("Events request ", response);
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response;
    } catch (ex) {
        console.log("Events request ex ", ex);
        throw ex
    }
}

async function fetchAllEventMarkers(viewPortLeftTopCoordinate,
                                    viewPortRightBottomCoordinate,
                                    delta,
                                    datasetId) {
    try {

        const cellSize = calculateCell(viewPortLeftTopCoordinate, viewPortRightBottomCoordinate);

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
};

function calculateCell(viewPortLeftTopCoordinate,
                       viewPortRightBottomCoordinate,) {
    let cellSize = 0;
    if (viewPortRightBottomCoordinate.longitude > viewPortLeftTopCoordinate.longitude) {
        cellSize = 28 * (viewPortRightBottomCoordinate.longitude - viewPortLeftTopCoordinate.longitude) / SCREEN_WIDTH;
    } else {
        cellSize = (180 - viewPortLeftTopCoordinate.longitude + viewPortRightBottomCoordinate.longitude + 180) * 28 / SCREEN_WIDTH;
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
                                     datasetId,
                                     markers
                                 }) {
    try {

        const body = {
            datasetId,
            cellSize,
            coordinates,
        };
        const response = await Api.post(
            API_ENDPOINTS.FETCH_CLUSTER_EVENTS,
            body,
        );

        let newMarkers = [];
        if (response && response.data && Array.isArray(response.data)) {
            const angleBetweenPoints = 360 / response.data.length;
            newMarkers = [
                ...markers.filter(({id}) => id !== clusterId),
                ...response.data.map((marker, index) => ({
                    ...marker,
                    location: destinationPoint(
                        marker.location,
                        3,
                        index * angleBetweenPoints,
                    ),
                    isTrashpile: true,
                })),
            ]
        }
        return newMarkers;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export default {
    searchEventsRequest,
    loadEvent,
    fetchAllEventMarkers,
    calculateDelta,
    fetchClustersList,
};