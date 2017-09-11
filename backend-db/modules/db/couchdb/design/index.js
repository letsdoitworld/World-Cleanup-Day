/**
 * This contains design document definition for CouchDB views.
 *
 * The first level contains database names. They will be looked up
 * when the service starts and the ones that don't exist will be created.
 *
 * Second level contains design documents.
 *
 * Design doc special property '$version' is an integer that will be stored
 * in the db and later compared against. If the code version is higher, the
 * design document will be updated (and reindexed). If the code version is
 * lower, the service will refuse to start.
 *
 * Design doc special property 'views' holds one or more views, each of them
 * having 1-2 properties, 'map' (mandatory), and 'reduce' (optional).
 */
'use strict';

const tools = require('./tools');
const templates = require('./templates');
// const util = require('module-util');

// const VERSION_TS = util.time.getNowUNIX();

/*global emit $$COPY_SANS_GEOMETRY$$ */
const designDocs = {
    datasets: {
        all: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'dataset') {
                            emit(doc._id, doc);
                        }
                    },
                },
            },
        },
    },
    accounts: {
        all: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'account') {
                            emit(doc._id, doc);
                        }
                    },
                },
            },
        },
        byName: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'account') {
                            emit(doc.name, doc);
                        }
                    },
                },
            },
        },
        countAll: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'account') {
                            emit(null, null);
                        }
                    },
                    reduce: '_count',
                },
            },
        },
    },
    sessions: {
        all: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'session') {
                            emit(doc._id, doc);
                        }
                    },
                },
            },
        },
    },
    areas: {
        all: {
            $version: 1,
            views: {
                view: tools.makeAreaView({
                    map: function (doc) {
                        var COPY_SANS_GEOMETRY = $$COPY_SANS_GEOMETRY$$;
                        if (doc.$doctype === 'area') {
                            emit(doc._id, COPY_SANS_GEOMETRY(doc));
                        }
                    },
                }),
            },
        },
        // geometry: {
        //     $version: util.time.getNowUNIX(),
        //     views: {
        //         view: {
        //             map: function (doc) {
        //                 if (doc.$doctype === 'area') {
        //                     emit(doc._id, doc.geometry);
        //                 }
        //             },
        //         },
        //     },
        // },
        // geoLocation: {
        //     $version: util.time.getNowUNIX(),
        //     spatial: {
        //         points: function (doc) {
        //             if (doc.$doctype === 'area' && doc._id === 'RO') {
        //                 emit(doc.geometry, doc._id);
        //             }
        //         },
        //     },
        // },
        byParent: {
            $version: 1,
            views: {
                view: tools.makeAreaView({
                    map: function (doc) {
                        var COPY_SANS_GEOMETRY = $$COPY_SANS_GEOMETRY$$;
                        if (doc.$doctype === 'area') {
                            emit(doc.parentId, COPY_SANS_GEOMETRY(doc));
                        }
                    },
                }),
            },
        },
        byLeader: {
            $version: 1,
            views: {
                view: tools.makeAreaView({
                    map: function (doc) {
                        var COPY_SANS_GEOMETRY = $$COPY_SANS_GEOMETRY$$;
                        if (doc.$doctype === 'area' && doc.leaderId) {
                            emit(doc.leaderId, COPY_SANS_GEOMETRY(doc));
                        }
                    },
                }),
            },
        },
        countByLeader: {
            $version: 1,
            views: {
                view: tools.makeAreaView({
                    map: function (doc) {
                        if (doc.$doctype === 'area' && doc.leaderId) {
                            emit(doc.leaderId, null);
                        }
                    },
                    reduce: '_count',
                }),
            },
        },
    },
    images: {
        all: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'image') {
                            emit(doc._id, doc);
                        }
                    },
                },
            },
        },
        byTrashpointAndStatusAndCreation: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'image') {
                            emit([
                                doc.trashpointId,
                                doc.status,
                                doc.createdAt,
                            ], doc);
                        }
                    },
                },
            },
        },
        byTrashpointAndParent: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'image') {
                            emit([
                                doc.trashpointId,
                                doc.parentId,
                            ], doc);
                        }
                    },
                },
            },
        },
    },
    trashpoints: {
        all: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            emit(doc._id, doc);
                        }
                    },
                },
            },
        },
        byArea: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            if (doc.areas.length) {
                                doc.areas.forEach(function (a) {
                                    emit([a, doc.createdAt], doc);
                                });
                            }
                            else {
                                emit([null, doc.createdAt], doc);
                            }
                        }
                    },
                },
            },
        },
        countAreaStatus: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            if (doc.areas.length) {
                                doc.areas.forEach(function (a) {
                                    emit([a, doc.status], null);
                                });
                            }
                            else {
                                emit([null, doc.status], null);
                            }
                        }
                    },
                    reduce: '_count',
                },
            },
        },
        byCreationTime: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            emit(doc.createdAt, doc);
                        }
                    },
                },
            },
        },
        byCreatingUser: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            emit([doc.createdBy, doc.createdAt], doc);
                        }
                    },
                },
            },
        },
        countAll: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            emit(doc._id, null);
                        }
                    },
                    reduce: '_count',
                },
            },
        },
        countByCreatingUser: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'trashpoint') {
                            emit(doc.createdBy, null);
                        }
                    },
                    reduce: '_count',
                },
            },
        },
    },
};

designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(1, 'isolated', templates.isolatedTrashpoints),
);
designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(1, 'clusters', templates.trashpointClusters),
);
designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(1, 'byGridCell', templates.trashpointsByGridCell),
);

module.exports = designDocs;
