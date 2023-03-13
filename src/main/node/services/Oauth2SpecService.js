const include = require('nodejs-require-enhancer');
const CustomError = include('/src/main/node/exceptions/CustomError.js');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');
const escape = require('escape-html');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const ObjectHelper = include('/src/main/node/common/ObjectHelper.js')

@Services
function Oauth2SpecService() {

    @Autowire(name = "configuration")
    this.configuration;
  
    @Autowire(name = "subjectService")
    this.subjectService;

    @Autowire(name = "microsoftLoginService")
    this.microsoftLoginService;    

    this.generateToken = async(generateTokenRequest) => {

        if (!ObjectHelper.hasProperty(this.configuration, "oauth2.jwtSecret")) {
            console.log("oauth2.jwtSecret was not found");
            return {
                code: 401501,
                message: "Internal error"
            };
        }

        if (!generateTokenRequest.grant_type) {
            let response = {
                code: 401400,
                message: "grant_type is required"
            };
            return response;
        }

        var subject_identifier, subject_secret
        if (generateTokenRequest.grant_type == "client_credentials") {
            if (typeof generateTokenRequest.client_id === 'undefined' || typeof generateTokenRequest.client_secret === 'undefined') {
                let response = {
                    code: 401402,
                    message: "client_id and client_secret are required"
                };
                return response;
            }
            subject_identifier = escape(generateTokenRequest.client_id)
            subject_secret = escape(generateTokenRequest.client_secret)
        } else if (generateTokenRequest.grant_type == "password") {
            if (!generateTokenRequest.username || !generateTokenRequest.password) {
                let response = {
                    code: 401403,
                    message: "username and password are required"
                };
                return response;
            }
            subject_identifier = escape(generateTokenRequest.username)
            subject_secret = escape(generateTokenRequest.password)
        } else {
            let response = {
                code: 401401,
                message: "unkown grant"
            };
            return response;
        }

        var subject;
        try {
            subject = await this.subjectService.findByIdentifier(subject_identifier);
        } catch (e) {
            console.log("database error while subject was be querying");
            console.log(e);
            let response = {
                code: 401502,
                message: "internal error"
            };
            return response;
        }

        if (subject.length == 0) {
            console.log("User was not found: " + subject_identifier);
            let response = {
                code: 401000,
                message: "Unauthorized"
            };
            return response;
        }

        var isItsCredential = await bcrypt.compare(subject_secret, subject[0].secret)
        if (isItsCredential === false) {
            //TODO: add fba
            console.log("Incorrect password: " + subject_identifier);
            let response = {
                code: 401000,
                message: "unauthorized"
            };
            return response;
        }

        //#TODO: validate at least one role

        var longLiveTokenUuid = subject[0].longLiveTokenUuid;
        var jwtExpiration;
        var access_token
        if (typeof longLiveTokenUuid === 'undefined' || longLiveTokenUuid == "") {
            //empty/null longLiveTokenUuid means a normal  and expirable token
            jwtExpiration = this.configuration.oauth2.jwtExpiration || "3600s";
            access_token = generateJwtToken({
                    subject_identifier: subject_identifier,
                    type: "acc",
                    lltu: longLiveTokenUuid
                },
                this.configuration.oauth2.jwtSecret, jwtExpiration);
        } else {
            access_token = generateJwtToken({
                    subject_identifier: subject_identifier,
                    type: "acc",
                    lltu: longLiveTokenUuid
                },
                this.configuration.oauth2.jwtSecret);
        }

        let response = {
            code: 200000,
            message: "success",
            content: {
                access_token: access_token,
                expires_in: jwtExpiration
            }
        };
        return response;
    }

    //TODO: make it private
    this.generateTokenFromSubject = async(subjectIdentifier) => {

        if (this.configuration.hasProperty("oauth2.jwtSecret")===false) {
            console.error("oauth2.jwtSecret is not configured");
            throw new CustomError(ApiResponseCodes.missing_system_configuration.reason, 
                ApiResponseCodes.missing_system_configuration.code);
        }

        if (this.configuration.hasProperty("oauth2.jwtExpiration")===false) {
            console.error("oauth2.jwtExpiration is not configured");
            throw new CustomError(ApiResponseCodes.missing_system_configuration.reason, 
                ApiResponseCodes.missing_system_configuration.code);
        }        

        if (typeof subjectIdentifier === 'undefined') {
            console.error("subjectIdentifier is required");
            throw new CustomError(ApiResponseCodes.bad_request_missing_field.reason, 
                ApiResponseCodes.bad_request_missing_field.code);
        }
        
        var subject;
        try {
            subject = await this.subjectService.findSubjectByIdentifier(subjectIdentifier);
        } catch (e) {
            console.log("database error while subject was be querying");
            console.log(e);
            throw new CustomError(ApiResponseCodes.internal_error.reason, 
                ApiResponseCodes.internal_error.code);
        }

        if (subject.length == 0) {
            console.log("User was not found: " + subjectIdentifier);
            throw new CustomError(ApiResponseCodes.user_not_found.reason, 
                ApiResponseCodes.user_not_found.code);
        }

        //TODO: validate at least one role
        access_token = generateJwtToken({
            subjectIdentifier: subjectIdentifier,
            type: "acc"
        },
        this.configuration.oauth2.jwtSecret, this.configuration.oauth2.jwtExpiration);

        let response = {
            access_token: access_token,
            expires_in: this.configuration.oauth2.jwtExpiration
        }
        return response;
    }

    this.introspectToken = async(token) => {
      return await jwt.verify(token, this.configuration.oauth2.jwtSecret);
    }

    this.generateTokenFromMicrosoftAuthCode = async(microsoftAuthCode) => {

        if (typeof microsoftAuthCode === 'undefined') {
            console.error("microsoft auth code is required");
            throw new CustomError(ApiResponseCodes.bad_request_missing_field.reason, 
                ApiResponseCodes.bad_request_missing_field.code);
        }

        //exchange authcode for an access_token
        var accesstoken = await this.microsoftLoginService.getAccessToken(microsoftAuthCode);

        var userDetails = await this.microsoftLoginService.getUserDetails(accesstoken);

        var tokenInformation = await this.generateTokenFromSubject(userDetails.mail);

        let response = {
            code: 200000,
            message: "success",
            content: tokenInformation
        };
        return response;        
    }

    generateJwtToken = function(payload, secret, expiresIn) {
        if (typeof expiresIn !== 'undefined') {
            return jwt.sign(payload, secret, {
                expiresIn: expiresIn
            });
        } else {
            return jwt.sign(payload, secret);
        }
    }
}

module.exports = Oauth2SpecService;