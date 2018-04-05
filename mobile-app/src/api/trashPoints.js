import Api from "../services/Api";
import types from "../reducers/trashpile/types";
import {API_ENDPOINTS} from "../shared/constants";
import {handleUpload} from "../reducers/trashpile/operations";
import {fetchTrashPointsDataSets} from "./datasets";

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
            datasetId: datasetId
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

        console.log(uploadStatus)
        console.log('uploadStatus')

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

export default {
    searchTrashPointsRequest,
    createTrashPointRequest
}