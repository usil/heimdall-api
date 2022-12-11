function ApiResponseCodes() {}

ApiResponseCodes.prototype.fromCode = function () {
};

ApiResponseCodes.success = {"code":200000,"reason":"success"};
ApiResponseCodes.internal_error = {"code":500100,"reason":"unexpected error"};

module.exports = ApiResponseCodes;