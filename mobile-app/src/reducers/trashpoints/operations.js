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
                        }
                    ]
                }
            );
        }, 3000)
    }).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
    })
}