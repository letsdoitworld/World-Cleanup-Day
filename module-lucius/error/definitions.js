'use strict';

module.exports = {
    EXAMPLE_ERROR_ONE: {
        message: () => `Something failed.`,
    },
    EXAMPLE_ERROR_TWO: {
        message: ({id}) => `Something failed and has to do with id "${id}".`,
    },
};
