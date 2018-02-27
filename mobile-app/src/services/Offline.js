import { SQLite } from 'expo';
import { Api } from "./index";

const offlineDB = SQLite.openDatabase('db.offline');

class OfflineService {

  constructor() {
    offlineDB.transaction(tx => {
      tx.executeSql(
        'drop table if exists trashpoints;'
      );
      tx.executeSql(
        'create table if not exists trashpoints (id integer primary key not null, url text, marker text, photos blob, dphotos text);'
      );
    });
  }

  saveTrashpoint(url, newMarker, photos, deletedPhotos) {
    offlineDB.transaction(tx => {
      tx.executeSql(
        'insert into trashpoints (url, marker, photos, dphotos) values (?, ?, ?, ?);', [
          url,
          JSON.stringify(newMarker),
          JSON.stringify(photos),
          JSON.stringify(deletedPhotos)
        ]
      );
    });
    return newMarker;
  }

  async syncToServer() {
    let trashpoints = [];
    offlineDB.transaction(tx => {
      tx.executeSql('select * from trashpoints', [], (_, { rows }) => {
        trashpoints = rows;
      });
    });

    for (let i = 0; i < trashpoints.length; i++) {
      let dataOk = true;
      let trashpoint = {};
      try {
        trashpoint = {id: trashpoints[i].id, url: trashpoints[i].url};
        trashpoint.marker = JSON.parse(trashpoints[i].marker);
        trashpoint.photos = JSON.parse(trashpoints[i].photos);
        trashpoint.dphotos = JSON.parse(trashpoints[i].dphotos);
      } catch (e) {
        dataOk = false;
      }
      if (dataOk) {
        const createMarkerResponse = await Api.put(trashpoint.url, trashpoint.marker);
        if (createMarkerResponse) {
          offlineDB.transaction(tx => {
            tx.executeSql(`delete from trashpoints where id = ?;`, [trashpoint.id]);
          });
        }
        // TODO! Add photo save
      }
    }
  }
}

export default new OfflineService();