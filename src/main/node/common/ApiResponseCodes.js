function ApiResponseCodes() {}

ApiResponseCodes.prototype.fromCode = function () {
};

ApiResponseCodes.success = {"code":200000,"reason":"success"};
ApiResponseCodes.internal_error = {"code":500100,"reason":"unexpected error"};
ApiResponseCodes.default_login_error_missing_redirect = {"code":500101,"reason":"login.default.redirectWebBaseurl is missing in config"};
ApiResponseCodes.login_unsupported_engine = {"code":500121,"reason":"unsupported login engine"};

module.exports = ApiResponseCodes;