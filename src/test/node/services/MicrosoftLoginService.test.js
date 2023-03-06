const include = require('nodejs-require-enhancer');
const chai = require('chai');
const expect = chai.expect;
const MicrosoftLoginService = include('/src/main/node/services/MicrosoftLoginService.js');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');
const sinon = require('sinon');
const axios = require('axios');


describe('MicrosoftLoginService : getAuthorizeUrl', function() {

    it('should return a custom error when params are missing', async function() {
        var microsoftLoginService = new MicrosoftLoginService();

        var expectedError;
        try {
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);


        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        responseType: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        responseType: "foo",
                        redirectUri: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);


        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        responseType: "foo",
                        redirectUri: "foo",
                        responseMode: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        responseType: "foo",
                        redirectUri: "foo",
                        responseMode: "foo",
                        scopes: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        //at this point with tenant value, all the required values exist
        //so the function should not return an error
        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        responseType: "foo",
                        redirectUri: "foo",
                        responseMode: "foo",
                        scopes: "foo",
                        tenant: "foo"
                    }
                }
            }
            await microsoftLoginService.getAuthorizeUrl();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError).to.eql(undefined);
    });

    it('should return a valid url when parameters are ok', async function() {
        var microsoftLoginService = new MicrosoftLoginService();
        microsoftLoginService.configuration = {
            login: {
                microsoft: {
                    oauth2BaseUrl: "foo.com",
                    clientId: "2",
                    responseType: "3",
                    redirectUri: "4",
                    responseMode: "5",
                    scopes: "6",
                    tenant: "7"
                }
            }
        }
        var url = microsoftLoginService.getAuthorizeUrl();
        expect(url).to.eql("foo.com/7/oauth2/v2.0/authorize?client_id=2&response_type=3&redirect_uri=4&response_mode=5&scope=6");
    });
});


describe('MicrosoftLoginService : getAccessToken', function() {

    it('should return a custom error when params are missing', async function() {
        var microsoftLoginService = new MicrosoftLoginService();

        var expectedError;
        try {
            await microsoftLoginService.getAccessToken();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo"
                    }
                }
            }
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);


        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                    }
                }
            }
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        clientSecret: "foo"
                    }
                }
            }
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);


        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        clientSecret: "foo",
                        redirectUri: "foo"
                    }
                }
            }
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        //at this point with tenant value, all the required values exist
        //but the function should fail because all values are fake
        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        oauth2BaseUrl: "foo",
                        clientId: "foo",
                        clientSecret: "foo",
                        redirectUri: "foo",
                        tenant: "foo"
                    }
                }
            }
            await microsoftLoginService.getAccessToken(123456789);
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.microsoft_access_token_low_level_error.code);

    });

    it('should return a valid access_token when parameters are ok', async function() {
        var microsoftLoginService = new MicrosoftLoginService();
        microsoftLoginService.configuration = {
            login: {
                microsoft: {
                    oauth2BaseUrl: "foo",
                    clientId: "foo",
                    clientSecret: "foo",
                    redirectUri: "foo",
                    tenant: "foo"
                }
            }
        }

        const res = {
            data: {
                access_token: "foo_bar_baz"
            },
            status: 200
        };
        mockStub = sinon.stub(axios, 'post').resolves(res);

        var access_token = await microsoftLoginService.getAccessToken(123456789);

        mockStub.restore();
        expect(access_token).to.eql("foo_bar_baz");
    });
});


describe('MicrosoftLoginService : getUserDetails', function() {

    it('should return a custom error when params are missing', async function() {
        var microsoftLoginService = new MicrosoftLoginService();

        var expectedError;
        try {
            await microsoftLoginService.getUserDetails();
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.microsoft_user_details_missing_token_error.code);

        expectedError = undefined;
        try {
            await microsoftLoginService.getUserDetails("123456789");
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);

        expectedError = undefined;
        try {
            microsoftLoginService.configuration = {
                login: {
                    microsoft: {
                        userDetailsApiEndpoint: "foo"
                    }
                }
            }
            await microsoftLoginService.getUserDetails("123456789");
        } catch (err) {
            expectedError = err;
        }
        expect(expectedError.code).to.eql(ApiResponseCodes.microsoft_user_details_low_level_error.code);

    });

    it('should return a valid user details when parameters are ok - mail', async function() {
        var microsoftLoginService = new MicrosoftLoginService();
        microsoftLoginService.configuration = {
            login: {
                microsoft: {
                    userDetailsApiEndpoint: "foo"
                }
            }
        }

        const res = {
            data: {
                displayName: "jane_doe",
                mail: "jane@mail.com",
            },
            status: 200
        };

        mockStub = sinon.stub(axios, 'create').callsFake(({
            baseURL = 'localhost'
        } = {}) => ({
            get: (path, data) => {
                return res
            },
        }));

        var userDetails = await microsoftLoginService.getUserDetails("123456789");

        mockStub.restore();
        expect(userDetails.displayName).to.eql("jane_doe");
        expect(userDetails.mail).to.eql("jane@mail.com");
    });

    it('should return a valid user details when parameters are ok - userPrincipalName', async function() {
        var microsoftLoginService = new MicrosoftLoginService();
        microsoftLoginService.configuration = {
            login: {
                microsoft: {
                    userDetailsApiEndpoint: "foo"
                }
            }
        }

        const res = {
            data: {
                displayName: "jane_doe",
                userPrincipalName: "jane@mail.com",
            },
            status: 200
        };
        mockStub = sinon.stub(axios, 'create').callsFake(({
            baseURL = 'localhost'
        } = {}) => ({
            get: (path, data) => {
                return res
            },
        }));

        var userDetails = await microsoftLoginService.getUserDetails("123456789");

        mockStub.restore();
        expect(userDetails.displayName).to.eql("jane_doe");
        expect(userDetails.mail).to.eql("jane@mail.com");
    });
});