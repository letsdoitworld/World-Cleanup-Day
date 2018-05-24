'use strict';
/**
 * This is a data adapter layer. It uses knowledge of database
 * data access primitives, application data entities and of
 * database fields with special meaning, and transparently
 * translates between application data entities and the database
 * raw format. The adapter should be used exclusively by the
 * abstraction layer, never directly from application logic.
 */

const SPECIAL_DB_FIELDS = ['_id', '_rev', '$doctype'];
const NOT_USER_WRITABLE_FIELDS = [
    ...SPECIAL_DB_FIELDS,
    'id', 'termsAcceptedAt', 'locked',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy',
];
const TYPE_TO_DB_MAP = {
    'Dataset': 'datasets',
    'Trashpoint': 'trashpoints',
    'Image': 'images',
    'Account': 'accounts',
    'Session': 'sessions',
    'Area': 'areas',
    'Team': 'teams'
};

const cdb = require('./driver');
const types =  require('../types');

const removeSpecialFields = doc => {
    SPECIAL_DB_FIELDS.forEach(name => delete doc[name]);
    return doc;
};

const removeDoNotUpdateFields = doc => {
    NOT_USER_WRITABLE_FIELDS.forEach(name => delete doc[name]);
    return doc;
};

const mergeNonSpecialFields = (doc, update) => {
    Object.getOwnPropertyNames(update).forEach(prop => {
        if (SPECIAL_DB_FIELDS.indexOf(prop) === -1) {
            doc[prop] = update[prop];
        }
    });
    return doc;
};

const prepareDocument = (doc, datatype, data, controlData = undefined) => {
    data = removeDoNotUpdateFields(data);
    if (controlData) {
        data = mergeNonSpecialFields(data, controlData);
    }
    data = types.normalizeData(datatype, data);
    return mergeNonSpecialFields(doc, data);
};

const adapter = {
    rawDocToEntity: (datatype, doc) => {
        if (!doc) {
            return doc;
        }
        if (doc._id) {
            doc.id = doc._id;
        }
        doc = removeSpecialFields(doc);
        doc = types.normalizeData(datatype, doc);
        return doc;
    },
    createDocument: async (datatype, id, data, controlData = undefined) => {
        if (!id) {
            return false;
        }
        const doc = prepareDocument({
            _id: id,
            $doctype: datatype.toLowerCase(),
        }, datatype, data, controlData);
        await cdb.insertDoc(TYPE_TO_DB_MAP[datatype], doc);
    },
    modifyDocument: async (datatype, doc, data, controlData = undefined) => {
        if (!doc) {
            return false;
        }
        doc = prepareDocument(doc, datatype, data, controlData);
        await cdb.updateDoc(TYPE_TO_DB_MAP[datatype], doc);
        return adapter.rawDocToEntity(datatype, doc);
    },
    removeDocument: async (datatype, view, id) => {
        if (!id) {
            return false;
        }
        const doc = await adapter.getOneRawDocById(datatype, view, id);
        if (!doc) {
            return false;
        }
        await cdb.deleteDoc(TYPE_TO_DB_MAP[datatype], id, doc._rev);
        return true;
    },
    getRawDocs: async (datatype, view, options = {}, mapValues = true) => {
        const ret = await cdb.getURI(
            TYPE_TO_DB_MAP[datatype],
            view,
            options
        );
        if (!mapValues) {
            return ret;
        }
        if (!ret) {
            return [];
        }
        return ret.data.rows.map(row => row.value);
    },
    getEntities: async (datatype, view, options = {}) => {
        const docs = await adapter.getRawDocs(datatype, view, options);
        if (!docs) {
            return [];
        }
        const ret = docs.map(d => adapter.rawDocToEntity(datatype, d));
        return ret;
    },
    getOneRawDocById: async (datatype, view, id) => {
        if (!id) {
            return false;
        }
        const docs = await adapter.getRawDocs(datatype, view, {key: id, sorted: false, limit: 1});
        if (!docs.length) {
            return false;
        }
        const ret = docs.pop();
        return ret;
    },
     getOneEntityById: async (datatype, view, id) => {
        if (!id) {
            return false;
        }
        const doc = await adapter.getOneRawDocById(datatype, view, id);
        if (!doc) {
            return false;
        }
        const ret = adapter.rawDocToEntity(datatype, doc);
        return ret;
    },
};

module.exports = adapter;
