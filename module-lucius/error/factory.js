'use strict';

module.exports = (name, constructor) => {
    const error = constructor;
    error.prototype = Object.create(Error.prototype);
    error.prototype.constructor = error;
    error.prototype.name = name;
    // XXX: Do NOT attach the stack to the error in this function.
    // This function is executed only once, when the module is initialized,
    // because it only creates the error prototype. A stack defined here
    // would only cover this file, regardless where the error is thrown.
    // You need to attach the stack inside the constructor.
    return error;
};
