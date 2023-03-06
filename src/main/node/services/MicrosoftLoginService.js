const include = require('nodejs-require-enhancer');
const CustomError = include('/src/main/node/exceptions/CustomError.js');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');
const ObjectHelper = include('/src/main/node/common/ObjectHelper.js');
const StringHelper = include('/src/main/node/common/StringHelper.js');
const axios = require("axios")
const querystring = require('querystring');

@Service
function MicrosoftLoginService() {
    
    @Autowire(name = "configuration")
    this.configuration;
    
    this.urlTemplate =
        "{oauth2BaseUrl}/{tenant}/oauth2/v2.0/authorize?client_id={clientId}&" +
        "response_type={responseType}&redirect_uri={redirectUri}&response_mode={responseMode}&scope={scopes}"

    this.getTokenUrlTemplate = "{oauth2BaseUrl}/{tenant}/oauth2/v2.0/token"
    this.codeGrantType = "authorization_code"

    this.getAuthorizeUrl = () => {

        var oauth2BaseUrl = ObjectHelper.getProperty("login.microsoft.oauth2BaseUrl", this.configuration);
        if (typeof oauth2BaseUrl === "undefined") {
            throw new CustomError("oauth2BaseUrl is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var clientId = ObjectHelper.getProperty("login.microsoft.clientId", this.configuration);
        if (typeof clientId === "undefined") {
            throw new CustomError("clientId is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var responseType = ObjectHelper.getProperty("login.microsoft.responseType", this.configuration);
        if (typeof responseType === "undefined") {
            throw new CustomError("responseType is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var redirectUri = ObjectHelper.getProperty("login.microsoft.redirectUri", this.configuration);
        if (typeof redirectUri === "undefined") {
            throw new CustomError("redirectUri is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var responseMode = ObjectHelper.getProperty("login.microsoft.responseMode", this.configuration);
        if (typeof responseMode === "undefined") {
            throw new CustomError("responseMode is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var scopes = ObjectHelper.getProperty("login.microsoft.scopes", this.configuration);
        if (typeof scopes === "undefined") {
            throw new CustomError("scopes is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        var tenant = ObjectHelper.getProperty("login.microsoft.tenant", this.configuration);
        if (typeof tenant === "undefined") {
            throw new CustomError("tenant is required to get the microsoft login url", ApiResponseCodes.missing_system_configuration.code);
        }

        return StringHelper.replaceValuesInString(this.urlTemplate, {
            oauth2BaseUrl: oauth2BaseUrl,
            clientId: clientId,
            responseType: responseType,
            redirectUri: redirectUri,
            responseMode: responseMode,
            scopes: querystring.escape(scopes),
            tenant: tenant
        });
    }

    this.getAccessToken = async(code) => {

        if (typeof code === "undefined") {
            throw new CustomError("code is required to get the microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var oauth2BaseUrl = ObjectHelper.getProperty("login.microsoft.oauth2BaseUrl", this.configuration);
        if (typeof oauth2BaseUrl === "undefined") {
            throw new CustomError("oauth2BaseUrl is required to get the microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var clientId = ObjectHelper.getProperty("login.microsoft.clientId", this.configuration);
        if (typeof clientId === "undefined") {
            throw new CustomError("clientId is required to get the microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var clientSecret = ObjectHelper.getProperty("login.microsoft.clientSecret", this.configuration);
        if (typeof clientSecret === "undefined") {
            throw new CustomError("clientSecret is required to get the microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var redirectUri = ObjectHelper.getProperty("login.microsoft.redirectUri", this.configuration);
        if (typeof redirectUri === "undefined") {
            throw new CustomError("redirectUri is required to get the microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var tenant = ObjectHelper.getProperty("login.microsoft.tenant", this.configuration);
        if (typeof tenant === "undefined") {
            throw new CustomError("tenant is required to get microsoft oauth2 access_token",
                ApiResponseCodes.missing_system_configuration.code);
        }

        var getAccessTokenFullUrl = StringHelper.replaceValuesInString(this.getTokenUrlTemplate, {
            oauth2BaseUrl: oauth2BaseUrl,
            tenant: tenant
        });

        var params = querystring.stringify({
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: this.codeGrantType
        });
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var response;

        try {
            response = await axios.post(getAccessTokenFullUrl,
                params, {
                    headers: headers
                });
        } catch (err) {
            console.debug(err);

            var detailedAxiosError;
            try {
                detailedAxiosError = {
                    message: err.message,
                    code: err.code,
                    ...err.response.data,
                    responseStatus: err.response.status,
                    responseStatusText: err.response.statusText
                }
            } catch (err2) {
                console.error("cannot get details from axios error response");
            }

            throw new CustomError("Error when trying to get access_token from " + getAccessTokenFullUrl +
                Object.entries(detailedAxiosError || {}).join(" "),
                ApiResponseCodes.microsoft_access_token_low_level_error.code, err);
        }

        var accessToken = ObjectHelper.getProperty("data.access_token", response);

        if (typeof accessToken === 'undefined') {
            throw new CustomError("Error when trying to get access_token from " + getAccessTokenFullUrl + " response",
                ApiResponseCodes.microsoft_access_token_low_level_error.code);
        }

        return accessToken;
    }


    this.getUserDetails = async(accessToken) => {

        if (typeof accessToken === "undefined") {
            throw new CustomError("accessToken is required to get the microsoft user details",
                ApiResponseCodes.microsoft_user_details_missing_token_error.code);
        }

        var userDetailsApiEndpoint = ObjectHelper.getProperty("login.microsoft.userDetailsApiEndpoint", this.configuration);
        if (typeof userDetailsApiEndpoint === "undefined") {
            throw new CustomError("userDetailsApiEndpoint is required to get the microsoft user details",
                ApiResponseCodes.missing_system_configuration.code);
        }

        const instance = axios.create({
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        var response;

        try {
            //for some reason axios.get don't work
            response = await instance.get(userDetailsApiEndpoint);
        } catch (err) {
            console.debug(err);
            var detailedAxiosError;
            try {
                detailedAxiosError = {
                    message: err.message,
                    code: err.code,
                    ...err.response.data,
                    responseStatus: err.response.status,
                    responseStatusText: err.response.statusText
                }
            } catch (err2) {
                console.error("cannot get details from axios error response");
            }

            throw new CustomError("Error when trying to get user details from " + userDetailsApiEndpoint +
                Object.entries(detailedAxiosError || {}).join(" "),
                ApiResponseCodes.microsoft_user_details_low_level_error.code, err);
        }

        var userDetails = response.data;

        var displayName = userDetails.displayName;
        var mail = userDetails.mail;

        if (typeof mail === 'undefined' || mail == "" || mail == "null") {
            mail = userDetails.userPrincipalName;
            if (typeof mail === 'undefined' || mail == "" || mail == "null") {
                console.error(JSON.stringify(response.data))
                throw new CustomError("Error when trying to get user email from microsoft api " + userDetailsApiEndpoint,
                    ApiResponseCodes.microsoft_user_details_error.code);
            }

        }

        return {
            displayName: displayName,
            mail: mail
        };
    }

}

module.exports = MicrosoftLoginService;