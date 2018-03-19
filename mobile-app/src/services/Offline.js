import { SQLite } from 'expo';
import { Api } from "./index";
import { trashpileReducer } from '../reducers';
import { handleUpload, deleteImage } from "../reducers/trashpile/operations";

const offlineDB = SQLite.openDatabase('db.offline');

class OfflineService {

  constructor() {
    this.executeSql('CREATE TABLE IF NOT EXISTS trashpoints (id integer primary key not null, url text, marker text, photos blob, dphotos blob);');
  }

  executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) => offlineDB.transaction(tx => {
      tx.executeSql(sql, params, (_, { rows }) => resolve(rows._array), reject)
    }))
  }

  saveTrashpoint = async (url, newMarker, photos, deletedPhotos) => {
    const { location: { longitude, latitude } } = newMarker;
    if (!newMarker.address || newMarker.address.length < 1) {
      newMarker.address = ' ';
    }
    if (!newMarker.name || newMarker.name.length < 1) {
      newMarker.name = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
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
      tx.executeSql('SELECT * FROM trashpoints', [], async (_, { rows: { _array } }) => {

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
            const createMarkerResponse = await Api.put(trashpoint.url, trashpoint.marker);
            if (createMarkerResponse) {
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
                  console.log(ex);
                }
              }

            }
          }
        }
      });
    });
  }
}

export default new OfflineService();