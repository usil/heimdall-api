function ApiResponseCodes() {}

ApiResponseCodes.prototype.fromCode = function () {
};

ApiResponseCodes.success = {"code":200000,"reason":"success"};

ApiResponseCodes.internal_error = {"code":500100,"reason":"unexpected error"};
ApiResponseCodes.missing_system_configuration = {"code":500110,"reason":"Required system configuration is missing"};
ApiResponseCodes.default_login_error_missing_redirect = {"code":500101,"reason":"login.default.redirectWebBaseurl is missing in config"};
ApiResponseCodes.login_unsupported_engine = {"code":500121,"reason":"unsupported login engine"};

ApiResponseCodes.bad_request_missing_field = {"code":400100,"reason":"Required field is missing"};

ApiResponseCodes.user_not_found = {"code":401100,"reason":"User was not found"};

ApiResponseCodes.microsoft_access_token_low_level_error = {"code":500111,"reason":"Cannot retrieve access_token from microsoft"};
ApiResponseCodes.microsoft_user_details_missing_token_error = {"code":500112,"reason":"Cannot retrieve user details from microsoft due to missing access_token"};
ApiResponseCodes.microsoft_user_details_low_level_error = {"code":500113,"reason":"Cannot retrieve user details from microsoft"};
ApiResponseCodes.microsoft_user_details_error = {"code":500114,"reason":"Cannot retrieve user email from microsoft userDetailsApiEndpoint"};

module.exports = ApiResponseCodes;