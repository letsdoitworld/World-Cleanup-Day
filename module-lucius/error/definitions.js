'use strict';

module.exports = {
    INVALID_TYPE: {
        message: ({parameter}) => `Parameter (${parameter}) is not a valid.`,
    },
    API_UNEXPECTED_ERROR: {
        message: () => `An unexpected error has occured.`,
    },
    AUTH_UNKNOWN_REMOTE_AUTHORITY: {
        message: ({authority}) => `Unknown remote authority '${authority}'.`,
    },
    AUTH_NO_PERMISSIONS: {
        message: () => `You have no permissions for getting this data.`,
    },
    AUTH_REMOTE_ERROR: {
        message: ({message}) => `An error has occured while querying a remote authority: ${message}`,
    },
    AUTH_INVALID_TOKEN: {
        message: () => `Provided token has failed verification.`,
    },
    AUTH_CANNOT_GENERATE_TOKEN: {
        message: () => `Could not generate token.`,
    },
    AUTH_ACCOUNT_IS_LOCKED: {
        message: () => `Account has been locked.`,
    },
    DATASET_NOT_FOUND: {
        message: ({id}) => `Dataset does not exist: '${id}'.`,
    },
    DATASET_TYPE_MISMATCH: {
        message: ({id, wantedType, actualType}) =>
            `Dataset '${id}' should have type '${wantedType}' but has '${actualType}'.`,
    },
    AREA_NOT_FOUND: {
        message: ({id}) => `Area does not exist: '${id}'.`,
    },
    AREA_LEADER_EXISTS: {
        message: ({id}) => `Area '${id}' already has a leader.`,
    },
    ACCOUNT_NOT_SUBJECT_TO_LEADER: {
        message: ({accountId, leaderId}) => `Account ${accountId} cannot be modified by leader '${leaderId}'.`,
    },
    ACCOUNT_ROLE_UNFIT_FOR_LEADER: {
        message: ({id, role}) => `Role '${role}' of account '${id}' cannot become area leader.`,
    },
    ACCESS_DENIED: {
        message: () => `Not enough privileges for performing this operation.`,
    },
    ACCOUNT_NOT_FOUND: {
        message: ({id}) => `Account does not exist: '${id}'.`,
    },
    ACCOUNT_HAS_ACTIVE_EVENTS: {
        message: ({id}) => `Account '${id}' has active events.`,
    },
    ACCOUNT_CANNOT_SELF_LOCK: {
        message: () => `An account cannot set lock status on itself.`,
    },
    COUNTRY_REQUIRED: {
        message: () => `Area leaders must provide a country with the request.`,
    },
    TRASHPOINT_NOT_FOUND: {
        message: ({id}) => `Trashpoint does not exist: '${id}'.`,
    },
    TRASHPOINT_ALREADY_INCLUDED: {
        message: ({trashpointId}) => `Trashpoint '${trashpointId}' already included.`,
    },
    EVENT_NOT_FOUND: {
        message: ({id}) => `Event does not exist: '${id}'.`,
    },
    IMAGE_NOT_FOUND: {
        message: ({id}) => `Image does not exist: '${id}'.`,
    },
    IMAGE_NOT_IN_TRASHPOINT: {
        message: ({id, trashpointId}) => `Image '${id}' not found under trashpoint '${trashpointId}'.`,
    },
    IMAGE_DELETE_FAILED: {
        message: ({id}) => `Image could not be deleted: '${id}'.`,
    },
    STORAGE_DELETE_FAILED: {
        message: ({resourceId, container, blob}) => `Storage delete failed for resource '${resourceId}', container '${container}', blob '${blob}'.`,
    },
    IMAGE_NOT_PENDING: {
        message: ({id}) => `Image is not expecting confirmation: '${id}'.`,
    },
    IMAGE_NOT_READY: {
        message: ({id}) => `Image is not ready for use: '${id}'.`,
    },
    IMAGE_NOT_MAIN: {
        message: ({id}) => `Image is not a main image: '${id}'.`,
    },
    IMAGE_CONFIRM_FAILED: {
        message: ({id}) => `Confirmation failed for this image: ${id}.`,
    },
    SESSION_NOT_FOUND: {
        message: ({id}) => `Session not found: '${id}'.`,
    },
    OFFLINE_ATTENDEES: {
        message: () => `The number of offline attendees must be less or equal to the maximum number`
    },
};
