import Api from '../services/Api';
import {API_ENDPOINTS, MIN_ZOOM, SCREEN_WIDTH} from "../shared/constants";
import { datasetUUID } from "../store/selectors";
import { fetchDatasetUIIDAction } from "../store/actions/app";
import { guid, getDistanceBetweenPointsInMeters, getGridValue } from "../shared/helpers";
import types from "../reducers/trashpile/types";

export function searchEventsRequest(query, page, pageSize, location) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(
                {
                    status: true,
                    events: [
                        {
                            id: 0,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 49,
                                    latitude: 35,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: true,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 1,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 40,
                                    latitude: 38,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 2,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 40,
                                    latitude: 40,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 3,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 49,
                                    latitude: 49,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 4,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 47,
                                    latitude: 37,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 5,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 47,
                                    latitude: 39,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 6,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 52,
                                    latitude: 30,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 7,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 49.505,
                                    latitude: 34.002,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 8,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 49.006,
                                    latitude: 32,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 9,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 43,
                                    latitude: 33,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 10,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 43,
                                    latitude: 37,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 11,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 50,
                                    latitude: 30,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 12,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 44,
                                    latitude: 34,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 13,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 45,
                                    latitude: 35,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 14,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 55,
                                    latitude: 35,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 15,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 58,
                                    latitude: 38,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 16,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 49.600,
                                    latitude: 35.400,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 17,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 39.90,
                                    latitude: 34.44,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 18,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 47.800,
                                    latitude: 37.9,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 19,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 45.009,
                                    latitude: 39.02,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 20,
                            organization_name: "dsdsdsd",
                            date: '11.02.2018',
                            cover_picture: "https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg",
                            available: 3,
                            all: 20,
                            place: {
                                location: {
                                    longitude: 42,
                                    latitude: 32,
                                },
                                distance: 4,
                                city: 'Dnipro',
                                country: 'Ukraine'
                            },
                            participant: false,
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        }
                    ]
                        .filter((trashPoint) => query === undefined || query === null || trashPoint.title.startsWith(query))
                        .slice(page * pageSize, page * pageSize + pageSize)
                }
            );
        }, 3000)
    }).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
    })
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
    fetchAllEventMarkers,
    calculateDelta,
}