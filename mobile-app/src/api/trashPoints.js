
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
                            status: 'outdated',
                            location: {
                                longitude: 35.0462,
                                latitude: 48.4647,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 1,
                            isIncluded: false,
                            status: 'cleaned',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 2,
                            isIncluded: false,
                            status: 'regular',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 3,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0464,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 4,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0454,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 5,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0469,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 6,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0454,
                                latitude: 48.4647,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 7,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0448,
                                latitude: 48.4647,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 8,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4645,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 9,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4643,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 10,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4649,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 11,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4646,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 12,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4648,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 13,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0460,
                                latitude: 48.4644,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 14,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0451,
                                latitude: 48.4647,
                            },
                            title: "fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd",
                        },
                        {
                            id: 15,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4645,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 16,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0462,
                                latitude: 48.4646,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 17,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4649,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 18,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0465,
                                latitude: 48.4646,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 19,
                            isIncluded: true,
                            status: 'urgent',
                            location: {
                                longitude: 35.0461,
                                latitude: 48.4646,
                            },
                            title: "fdfdffd",
                        },
                        {
                            id: 20,
                            isIncluded: false,
                            status: 'urgent',
                            location: {
                                longitude: 35.0457,
                                latitude: 48.4657,
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

export default {
    searchTrashPointsRequest
}