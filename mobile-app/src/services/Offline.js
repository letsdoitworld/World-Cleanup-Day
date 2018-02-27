import { SQLite } from 'expo';
import { Api } from "./index";

const offlineDB = SQLite.openDatabase('db.offline');

class OfflineService {

  constructor() {
    offlineDB.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS trashpoints (id integer primary key not null, url text, marker text, photos blob, dphotos blob);'
      );
    });
  }

  async saveTrashpoint(url, newMarker, photos, deletedPhotos) {
    let result = false;
    await offlineDB.transaction(tx => {
      tx.executeSql(
        'INSERT INTO trashpoints (url, marker, photos, dphotos) VALUES (?, ?, ?, ?);', [
          url,
          JSON.stringify(newMarker),
          JSON.stringify(photos),
          JSON.stringify(deletedPhotos)
        ], (result) => { result = true; }
      );
    });
    return result === false ? result : newMarker;
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
                tx.executeSql(`DELETE FROM trashpoints WHERE id = ?;`, [trashpoint.id]);
              });

              //TODO! Add work with photos to this place
            }
          }
        }
      });
    });
  }
}

export default new OfflineService();