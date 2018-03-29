import Api from "../services/Api";

export async function fetchTrashPointsDataSets() {
    try {

        const response = await Api.get('datasets', {
            withToken: false,
        });

        if (!response || !response.data) {
            throw {error: 'Could not load trashPointsDatasets'};
        }
        return response;
    } catch (ex) {
        throw ex
    }
}
