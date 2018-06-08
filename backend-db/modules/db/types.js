'use strict';
const util = require('module-util');

const declareConstants = (obj, constants) => {
    Object.getOwnPropertyNames(constants).forEach(name => {
        Object.defineProperty(obj, name, {
            value: constants[name],
            writable: false,
        });
    });
}

const declareStatusConstants = (c) => declareConstants(c, {
    STATUS_REGULAR: 'regular',
    STATUS_URGENT: 'urgent',
    STATUS_THREAT: 'threat',
    STATUS_CLEANED: 'cleaned',
    STATUS_OUTDATED: 'outdated',
});

class Type {
    constructor(data) {
        this.value = data;
    }
    export() {
        return this.value;
    }
}

class Dataset extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            type: true,
            createdAt: true,
        });
        //FIXME: validate field values
    }
}
declareConstants(Dataset, {
    TYPE_TRASHPOINTS: 'trashpoints',
});

class Account extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            name: true,
            email: true,
            role: true,
            pictureURL: true,
            country: true,
            termsAcceptedAt: true,
            locked: true,
            createdAt: true,
            createdBy: true,
            updatedAt: true,
            updatedBy: true,
            public: false
        });
        //FIXME: validate field values
    }
    static makeAccountIdFromSocial(socialNetwork, socialUserId) {
        return socialNetwork + ':' + socialUserId;
    }
}
declareConstants(Account, {
    ROLE_VOLUNTEER: 'volunteer',
    ROLE_LEADER: 'leader',
    ROLE_ADMIN: 'admin',
    ROLE_SUPERADMIN: 'superadmin',
});

class Session extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            accountId: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
        });
    }
    static makeSessionIdFromAccountId(accountId) {
        if (!accountId || typeof accountId !== 'string') {
            throw new TypeError(`Invalid account id: '${accountId}'`);
        }
        return 'session-' + accountId;
    }
}

class Event extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            datasetId: true,
            name: true,
            address: true,
            location: {
                latitude: true,
                longitude: true,
            },
            areas: true,
            description: true,
            whatToBring: true,
            coordinatorName: true,
            createDate: true,
            updateDate: true,
            startTime: true,
            endTime: true,
            email: true,
            phonenumber: true,
            trashpoints: true,
            maxPeopleAmount: true,
            offlineAttendeesAmount: true,
            attendeesAmount: true,
            createdBy: true,
            updatedBy: true,
        });
    }
}

class Trashpoint extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            datasetId: true,
            location: {
                latitude: true,
                longitude: true,
            },
            areas: true,
            status: true,
            amount: true,
            composition: true,
            name: true,
            address: true,
            hashtags: true,
            counter: true,
            createdAt: true,
            createdBy: true,
            updatedAt: true,
            updatedBy: true,
            isIncluded: true
        });
        //FIXME: validate field values
    }
}
declareStatusConstants(Trashpoint);
declareConstants(Trashpoint, {
    AMOUNT_HANDFUL: 'handful',
    AMOUNT_BAGFUL: 'bagful',
    AMOUNT_CARTLOAD: 'cartload',
    AMOUNT_TRUCKLOAD: 'truckload',
});
declareConstants(Trashpoint, {
    COMPOSITION_GLASS: 'glass',
    COMPOSITION_ELECTRONICS: 'electronics',
    COMPOSITION_PAPER: 'paper',
    COMPOSITION_DOMESTIC: 'domestic waste',
    COMPOSITION_FURNITURE: 'furniture',
    COMPOSITION_ORGANIC: 'organic waste',
    COMPOSITION_PLASTIC: 'plastic',
    COMPOSITION_METAL: 'metal',
    COMPOSITION_TYRES: 'tyres',
});

class Image extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            type: true,
            status: true,
            file: true,
            url: true,
            server: true,
            trashpointId: true,
            eventId: true,
            parentId: true,
            createdAt: true,
            createdBy: true,
            updatedAt: true,
            updatedBy: true,
        });
        //FIXME: validate type, status
    }
    static makeContainerName(type) {
        return Image.CONTAINER_PREFIX + type;
    }
}
declareConstants(Image, {
    CONTAINER_PREFIX: 'images-',
    TYPE_MEDIUM: 'medium',
    TYPE_THUMBNAIL: 'thumbnail',
    STATUS_PENDING: 'pending',
    STATUS_READY: 'ready',
});

class Cluster extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            count: true,
            status: true,
            location: true,
            coordinates: true,
        });
        //FIXME: validate field values
    }
}
declareStatusConstants(Cluster);

class Area extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true, // ie. code US.CA.SF
            name: true,
            outline: true,
            parentId: true,
            leaderId: true,
            updatedAt: true,
            updatedBy: true,
        });
        //FIXME: validate field values
    }
}

class Detail extends Type {
    constructor(data) {
        super();
        this.value = util.object.filter(data, {
            id: true,
            trashpointCompositions: true,
            trashpointOrigins: true,
            updatedAt: true,
            createdAt: true,
        });
    }
}

const datatypeFactory = (datatype, data) => {
    switch (datatype) {
    case 'Dataset':
        return new Dataset(data);
    case 'Image':
        return new Image(data);
    case 'Trashpoint':
        return new Trashpoint(data);
    case 'Account':
        return new Account(data);
    case 'Session':
        return new Session(data);
    case 'Cluster':
        return new Cluster(data);
    case 'Area':
        return new Area(data);
    case 'Event':
        return new Event(data);
    case 'Detail':
        return new Detail(data);
    default:
        throw new TypeError(`Unknown data type '${datatype}'.`)
    }
};

const normalizeData = (datatype, data) => (datatypeFactory(datatype, data)).export();

module.exports = {
    datatypeFactory,
    normalizeData,
    Dataset, Account, Session, Trashpoint, Image, Cluster, Area, Event
};
