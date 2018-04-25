import {SQLite} from 'expo';
import {Api} from "./index";
import {handleUpload, deleteImage} from "../reducers/trashpile/operations";
import {operations as locationOperations} from '../reducers/location';

const offlineDB = SQLite.openDatabase('db.offline');

class OfflineService {

  constructor() {
    this.executeSql('CREATE TABLE IF NOT EXISTS trashpoints (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'url TEXT,' +
      'marker TEXT,' +
      'photos BLOB,' +
      'dphotos BLOB,' +
      'status INTEGER DEFAULT 0' +
      ');');
  }

  executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) => offlineDB.transaction(tx => {
      tx.executeSql(sql, params, (_, {rows}) => resolve(rows._array), reject)
    }))
  }

  saveTrashpoint = async (url, newMarker, photos, deletedPhotos) => {
    const {location: {longitude, latitude}} = newMarker;
    console.log('FIRST', {newMarker})
    if (!newMarker.address || newMarker.address.length < 1) {
      newMarker.address = ' ';
    }
    if (!newMarker.name || newMarker.name.length < 1) {
      newMarker.name = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
    console.log('SECOND', {newMarker})
    await this.executeSql('INSERT INTO trashpoints (url, marker, photos, dphotos) VALUES (?, ?, ?, ?);', [
      url,
      JSON.stringify(newMarker),
      JSON.stringify(photos),
      JSON.stringify(deletedPhotos)
    ]);
    const dummyReturn = {data: newMarker};

    return dummyReturn;
  }

  async syncToServer() {
    const transaction = await offlineDB.transaction(tx => {
      tx.executeSql('SELECT id FROM trashpoints WHERE status = 0', [], async (_, {rows: {_array}}) => {
        const idsToPush = [];
        for (let i = 0; i < _array.length; i++) {
          idsToPush.push(_array[i].id);
        }
        if (idsToPush.length > 0) {
          const whereIds = idsToPush.join(',');
          tx.executeSql('UPDATE trashpoints SET status = 1 WHERE id IN (' + whereIds + ')', []);
          tx.executeSql(
            'SELECT id, url, marker, photos, dphotos, status FROM trashpoints WHERE id IN (' + whereIds + ')',
            [], async (_, {rows: {_array}}) => {
              for (let i = 0; i < _array.length; i++) {
                let dataOk = true;
                let trashpoint = {};
                try {
                  trashpoint = {id: _array[i].id, url: _array[i].url};
                  trashpoint.marker = JSON.parse(_array[i].marker);
                  trashpoint.photos = JSON.parse(_array[i].photos);
                  trashpoint.dphotos = JSON.parse(_array[i].dphotos);
                } catch (e) {
                  dataOk = false;
                }
                if (dataOk) {
                  if ((trashpoint.marker.address === '' || trashpoint.marker.address === 0) && trashpoint.marker.location.latitude && trashpoint.marker.location.longitude) {
                    trashpoint.marker.address = await locationOperations.fetchAddress(trashpoint.marker.location);
                    if ((trashpoint.marker.name === '' || trashpoint.marker.name.length === 0) && trashpoint.marker.address) {
                      trashpoint.marker.name = `${trashpoint.marker.address.streetAddress} ${trashpoint.marker.address.streetNumber}`;
                    }
                  }
                  const createMarkerResponse = await Api.put(trashpoint.url, trashpoint.marker);
                  if (createMarkerResponse || !trashpoint.marker.datasetId) {
                    offlineDB.transaction(tx => {
                      tx.executeSql('DELETE FROM trashpoints WHERE id = ?;', [trashpoint.id]);
                    });
                    if (trashpoint.photos.length > 0) {
                      await handleUpload({
                        photos: trashpoint.photos,
                        markerId: createMarkerResponse.data.id
                      });
                    }
                    if (trashpoint.dphotos.length > 0) {
                      try {
                        await Promise.all(
                          trashpoint.dphotos.map(p => deleteImage(id, p.parentId)),
                        );
                      } catch (ex) {
                        // console.log(ex);
                      }
                    }
                  } else {
                    offlineDB.transaction(tx => {
                      tx.executeSql('UPDATE trashpoints SET status = 0 WHERE id = ?;', [trashpoint.id]);
                    });
                  }
                }
              }
            });
        }
      });


    });
  }
}

export default new OfflineService();