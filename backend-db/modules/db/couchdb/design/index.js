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
        byCountryAndName: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'account' && doc.country) {
                            emit([doc.country, doc.name], doc);
                        }
                    },
                },
            },
        },
        byNamePieces: {
            $version: 3,
            views: {
                view: {
                    map: function (doc) {
                        function splitter(L, bit) {
                            var chunks = {};
                            for (var i = 0; i < bit.length - L + 1; i++) {
                                chunks[bit.substring(i, i + L)] = true;
                            }
                            return chunks;
                        }
                        function collator(L, name) {
                            var bits = name.trim().toLowerCase().split(/\s+/);
                            var chunks = {};
                            for (var b = 0; b < bits.length; b++) {
                                Object.getOwnPropertyNames(splitter(L, bits[b])).forEach(function (prop) {
                                    chunks[prop] = true;
                                });
                            }
                            return Object.getOwnPropertyNames(chunks);
                        }
                        if (doc.$doctype === 'account') {
                            for (var i = 3; i <= 10; i++) {
                                var pieces = collator(i, doc.name);
                                for (var k = 0; k < pieces.length; k++) {
                                    emit([pieces[k], doc.country, doc.name], doc);
                                }
                            }
                        }
                    },
                    reduce: '_count',
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
        countByCountry: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'account' && doc.country) {
                            emit(doc.country, null);
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
        byTrashpointAndTypeAndStatusAndCreation: {
          $version: 1,
          views: {
            view: {
              map: function (doc) {
                if (doc.$doctype === 'image') {
                  emit([
                    doc.trashpointId,
                    doc.type,
                    doc.status,
                    doc.createdAt,
                  ], doc);
                }
              },
            },
          },
        },
        byEventAndTypeAndStatusAndCreation: {
          $version: 1,
          views: {
            view: {
              map: function (doc) {
                if (doc.$doctype === 'image') {
                  emit([
                    doc.eventId,
                    doc.type,
                    doc.status,
                    doc.createdAt,
                  ], doc);
                }
              },
            },
          },
        },
        byEventAndStatusAndCreation: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'image') {
                            emit([
                                doc.eventId,
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
        byEventAndParent: {
            $version: 1,
            views: {
                view: {
                    map: function (doc) {
                        if (doc.$doctype === 'image') {
                            emit([
                                doc.eventId,
                                doc.parentId,
                            ], doc);
                        }
                    },
                },
            },
        },
    },
    events: {
      all: {
          $version: 1,
          views: {
              view: {
                  map: function (doc) {
                      if (doc.$doctype === 'event') {
                          emit(doc._id, doc);
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
              if (doc.$doctype === 'event') {
                emit(doc._id, doc);
              }
            },
            reduce: '_count',
          },
        },
      },
      byTrashpoint: {
        $version: 1,
        views: {
          view: {
            map: function (doc) {
              if (doc.$doctype === 'event' && doc.trashpoints) {
                doc.trashpoints.forEach(function(trashpoint) {
                  emit(trashpoint, doc);
                })
              }
            },
          },
        },
      },
      byLocation: {
        $version: 1,
        views: {
          view: {
            map: function (doc) {
              if (doc.$doctype === 'event') {
                emit([doc.location.latitude, doc.location.longitude], doc);
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
              if (doc.$doctype === 'event') {
                emit([doc.createdBy, doc.createdAt], doc);
              }
            },
          },
        },
      },
      countByCreatingUser: {
        $version: 1,
        views: {
          view: {
            map: function (doc) {
              if (doc.$doctype === 'event') {
                emit(doc.createdBy, null);
              }
            },
            reduce: '_count',
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

/**
 * VERSION HISTORY FOR THE CLUSTERING VIEWS:
 * 1: grid cell location at cell center
 * 2: grid cell location at center of bbox of points in cell
 * 3: switch clustering slope from decimal levels to logarithmic
 * 4: fine-tune clustering logarithmic slope
 * 5: fix rereduce logic bug in 'isolated' views
 * 6: remap scales for viewport width in longitude degrees instead of viewport diagonal in meters
 * 7: fix rereduce logic bug in 'cluster' views
 * 8: change clustering slope function from exp(x) to 2^x
 */
designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(9, 'isolated', templates.isolatedTrashpoints),
);
designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(9, 'clusters', templates.trashpointClusters),
);
designDocs.trashpoints = Object.assign(
    designDocs.trashpoints,
    tools.makeGridScaleDesignDocs(9, 'byGridCell', templates.trashpointsByGridCell),
);
designDocs.events = Object.assign(
  designDocs.events,
  tools.makeGridScaleDesignDocs(9, 'isolated', templates.isolatedEvents),
);
designDocs.events = Object.assign(
  designDocs.events,
  tools.makeGridScaleDesignDocs(9, 'clusters', templates.eventClusters),
);
designDocs.events = Object.assign(
  designDocs.events,
  tools.makeGridScaleDesignDocs(9, 'byGridCell', templates.eventsByGridCell),
);


module.exports = designDocs;
