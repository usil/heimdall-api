function CustomError(message, code, error) {
    this.constructor.prototype.__proto__ = Error.prototype
    this.code = code
    this.message = message
    if (error) {
        Error.captureStackTrace(error);
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;