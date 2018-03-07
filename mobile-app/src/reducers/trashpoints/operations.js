import Api from '../../services/Api';
import actions from './actions';
import constants from "../../shared/constants";



export function searchTrashPointsRequest(query, page, pageSize, location) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(
                {
                    status: true,
                    trashPoints: [
                        {
                            id: 0,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 1,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 2,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 3,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 4,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 5,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 6,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 7,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 8,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 9,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 10,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 11,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 12,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 13,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 14,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 15,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 16,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 17,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 18,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 19,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 20,
                            isIncluded: false,
                            status: 'threat',
                            location: {
                                longitude: 49,
                                lantitude: 35,
                            },
                            title: "fdfdffd",
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