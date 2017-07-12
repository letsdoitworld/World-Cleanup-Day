'use strict';

module.exports = {
    AUTH_UNKNOWN_REMOTE_AUTHORITY: {
        message: ({authority}) => `Unknown remote authority "${authority}".`,
    },
    AUTH_REMOTE_ERROR: {
        message: ({message}) => `An error has occured while querying a remote authority: ${message}`,
    },
    AUTH_INVALID_TOKEN: {
        message: () => `Provided token has failed verification.`,
    },
};
