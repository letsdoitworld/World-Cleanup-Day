import Api from "../services/Api";
import {API_ENDPOINTS, MIN_ZOOM, SCREEN_WIDTH} from "../shared/constants";
import {handleUpload} from "../reducers/trashpile/operations";
import {fetchTrashPointsDataSets} from "./datasets";
import {guid} from "../shared/helpers";

export async function searchTrashPointsRequest(query, page, pageSize, location) {
    try {
        const response = await Api.get('trashpoints',
            {
                params: {
                    pageSize: pageSize,
                    pageNumber: page + 1,
                    location: location,
                    name: query
                },
            },
            {
                withToken: true,
            },);
        if (!response || !response.data) {
            throw {error: 'Could not load trashpoins'};
        }
        return response;
    } catch (ex) {
        throw ex
    }
}

export async function createTrashPointRequest(
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
) {
    try {
        const datasetId = await fetchTrashPointsDataSets();
        const newMarker = {
            hashtags,
            composition,
            location,
            status,
            name: name,
            address,
            amount,
            datasetId: datasetId,
        };

        const url = API_ENDPOINTS.CREATE_TRASHPOINT;

        const createMarkerResponse = await Api.put(url, newMarker);

        let uploadStatus;
        try {
            uploadStatus = await handleUpload({
                photos,
                markerId: createMarkerResponse.data.id,
            });
        } catch (error) {
            console.log(error)
        }

        return {
            data: {
                trashpoint: {...createMarkerResponse.data},
                photoStatus: uploadStatus ? uploadStatus : true
            }
        };
    } catch (error) {
        throw error
    }
}

async function fetchAllTrashPointsMarkers(viewPortLeftTopCoordinate,
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
};

function calculateCell(viewPortLeftTopCoordinate,
                       viewPortRightBottomCoordinate) {
    let cellSize = 0;
    if (viewPortRightBottomCoordinate.longitude > viewPortLeftTopCoordinate.longitude) {
        cellSize = 28 * (viewPortRightBottomCoordinate.longitude - viewPortLeftTopCoordinate.longitude) / SCREEN_WIDTH;
    } else {
        cellSize = (180 - viewPortLeftTopCoordinate.longitude + viewPortRightBottomCoordinate.longitude + 180) * 28 / SCREEN_WIDTH;
    }
    return cellSize;
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
            API_ENDPOINTS.FETCH_CLUSTER_TRASHPOINTS,
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
    searchTrashPointsRequest,
    createTrashPointRequest,
    fetchAllTrashPointsMarkers,
    fetchClustersList,
    calculateDelta,
    calculateCell
}