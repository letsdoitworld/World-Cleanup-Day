/**
 * This is a low level database access layer. It uses the
 * database SDK directly, performs connection initialization
 * procedures when first loaded, and exports helper methods
 * that provide access to data primitives but hide the
 * connection details.
 */
'use strict';

const COUCHDB_USER = process.env.COUCHDB_USER;
const COUCHDB_PASSWORD = process.env.COUCHDB_PASSWORD;
const COUCHDB_HOST = process.env.COUCHDB_HOST || 'couchdb';
const COUCHDB_PROTOCOL = process.env.COUCHDB_PROTOCOL || 'http';
const COUCHDB_PORT = process.env.COUCHDB_PORT || 5984;
const COUCHDB_URL = `${COUCHDB_PROTOCOL}://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_HOST}:${COUCHDB_PORT}`;

const caught = require('caught');
const logger = require('module-logger');
const designDefs = require('./design');
const NodeCouchDb = require('node-couchdb');
const request = require('request-promise');
const _ = require('lodash');

const couch = new NodeCouchDb({
    host: COUCHDB_HOST,
    protocol: COUCHDB_PROTOCOL,
    port: COUCHDB_PORT,
    timeout: 30000,
    auth: {
        user: COUCHDB_USER,
        pass: COUCHDB_PASSWORD,
    },
});

const stringifyFuncs = o => {
  Object.getOwnPropertyNames(o).forEach(prop => {
    if (typeof o[prop] === 'function') {
      o[prop] = o[prop].toString();
    } else if (typeof o[prop] === 'object') {
      o[prop] = stringifyFuncs(o[prop]);
    }
  });
  return o;
};

const mango = async (db, mangoQuery, params) => {
    try {
        return await couch.mango(db, mangoQuery, params);
    } catch (e) {
        throw e;
    }
};

const getURI = async (db, uri, options = {}) => {
    try {
        return await couch.get(db, uri, options);
    } catch (e) {
        if (e.code === 'EDOCMISSING') {
            return false;
        }
        throw e;
    }
};

const insertDoc = async (db, doc) => await couch.insert(db, doc);

const updateDoc = async (db, doc) => {
    return await couch.update(db, doc);
};

const deleteDoc = async (db, id, rev) => await couch.del(db, id, rev);

const temporaryView = async (db, view, options = {}) => {
  const data = await request.post({
    uri: `${COUCHDB_URL}/${db}/_temp_view`,
    method: 'POST',
    json: stringifyFuncs(view),
    qs: options
  });
  if (data) {
    data.rows = data.rows.map(r => {
      r.value.id = r.id;
      r.value = _.omit(r.value, ['_id', '_rev', '$doctype']);
      return r;
    })
  }
  return { data };
};

const checkDatabases = async () => {
    const dbList = await couch.listDatabases();
    if (!Array.isArray(dbList)) {
        throw new Error('Couch: database connection failed, please check username and password env vars.')
    }
    for (const dbName in designDefs) {
        if (!designDefs.hasOwnProperty(dbName)) {
            continue;
        }
        if (dbList.indexOf(dbName) === -1) {
            await couch.createDatabase(dbName);
            logger.warning(`Couch: database '${dbName}' was created.`);
        }
        else {
            logger.debug(`Couch: database '${dbName}' found.`);
        }
    }
};

// update views if missing/not latest version
const checkViews = async () => {
    for (let dbName of Object.getOwnPropertyNames(designDefs)) {
        const dDocs = designDefs[dbName];
        for (let dDocName of Object.getOwnPropertyNames(dDocs)) {
            if (!dDocs[dDocName] || typeof dDocs[dDocName] !== 'object') {
                logger.warning(`${dbName}.${dDocName} is not an object.`);
                continue;
            }
            const designDoc = dDocs[dDocName];
            // sanity check the design doc core props
            if (!designDoc.hasOwnProperty('$version')
                || typeof designDoc['$version'] !== 'number'
                || designDoc['$version'] < 1
            ) {
                throw new Error(`Couch: invalid design doc definition: ${dbName}.${dDocName}.$version must exist and be a strictly positive integer.`);
            }
            const $version = designDoc['$version'];
            // prepare the new doc
            const docId = '_design/' + dDocName;
            const newDoc = Object.assign(
                stringifyFuncs(designDoc),
                {_id: docId, language: 'javascript'}
            );
            // check the state of the existing doc, if any
            const ret = await getURI(dbName, docId);
            if (!ret) {
                await insertDoc(dbName, newDoc);
                logger.warning(`Couch: design doc '${dbName}/${docId}'@v${$version} was created.`);
            }
            else {
                const oldDoc = ret.data;
                const viewVersion = parseInt(oldDoc.$version);
                if (isNaN(viewVersion) || viewVersion < $version) {
                    newDoc._rev = oldDoc._rev;
                    await updateDoc(dbName, newDoc);
                    logger.warning(`Couch: design doc '${dbName}/${docId}'@v${$version} was updated.`);
                }
                else if (viewVersion > $version) {
                    throw new Error(`Couch: design doc '${dbName}/${docId}'@v${$version} is older than db@v${viewVersion}, aborting.`);
                }
                else {
                    //logger.info(`Couch: design doc '${dbName}/${docId}'@v${$version} found.`);
                }
            }
        }
    }
};

const SERVER_READY = caught(new Promise(async function (resolve, reject) {
    try {
        await checkDatabases();
        await checkViews();
        resolve();
    } catch (e) {
        reject(e);
    }
}));

module.exports = {
    SERVER_READY,
    getURI,
    insertDoc,
    updateDoc,
    deleteDoc,
    temporaryView,
    mango
};
