import Api from '../services/Api';

export async function fetchTrashPointsDataSets() {
  try {
    const response = await Api.get('datasets', {
      withToken: false,
    });

    if (!response || !response.data) {
      throw new Error('Could not load trashPointsDatasets');
    }
    return response.data.find(dataset => dataset.type === 'trashpoints').id;
  } catch (ex) {
    throw ex;
  }
}
