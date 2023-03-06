const include = require('nodejs-require-enhancer');
const chai = require('chai');
const expect = chai.expect;
const should = require('chai').should();
const Oauth2SpecService = include('/src/main/node/services/Oauth2SpecService.js');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');
const CustomError = include('/src/main/node/exceptions/CustomError.js');

function hasProperty(key) {
    try {
        var value = key.split(".").reduce((result, key) => {
            return result[key]
        }, this);
        return (typeof value !== 'undefined')
    } catch (err) {
        return false;
    }
}

describe('Oauth2SpecService : generateTokenFromMicrosoftAuthCode', function() {

    it('should return a custom error when code is missing', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromMicrosoftAuthCode();
        } catch (err) {
            expectedError = err;
        }
        should.exist(expectedError, "Error should exist");
        expect(expectedError.code).to.eql(ApiResponseCodes.bad_request_missing_field.code);        
    });

    it('should throw a custom error when microsoft fails to retrieve access_token due to missing system params', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        function microsoftLoginServiceMock() {
            this.getAccessToken = function () {
                throw new CustomError("I'm a fake error", ApiResponseCodes.missing_system_configuration.code);
            }
        }
        oauth2SpecService.microsoftLoginService = new microsoftLoginServiceMock();        

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromMicrosoftAuthCode("foo");
        } catch (err) {
            expectedError = err;
        }
        should.exist(expectedError, "Error should exist");
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);        
    });   
    
    it('should throw a custom error when microsoft fails to retrieve access_token due to http response', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        function microsoftLoginServiceMock() {
            this.getAccessToken = function () {
                throw new CustomError("I'm a fake error", ApiResponseCodes.microsoft_access_token_low_level_error.code);
            }
        }

        oauth2SpecService.microsoftLoginService = new microsoftLoginServiceMock();        

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromMicrosoftAuthCode("foo");
        } catch (err) {
            expectedError = err;
        }
        should.exist(expectedError, "Error should exist");
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.microsoft_access_token_low_level_error.code);        
    });

    it('should throw an error when microsoft fails to retrieve username from access_token due missing access_token', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        function microsoftLoginServiceMock() {

            this.getAccessToken = function () {
                return "foo_token"
            }

            this.getUserDetails = function () {
                throw new CustomError("accessToken is required to get the microsoft user details",
                ApiResponseCodes.microsoft_user_details_missing_token_error.code);
            }            
        }

        oauth2SpecService.microsoftLoginService = new microsoftLoginServiceMock();        

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromMicrosoftAuthCode("foo");
        } catch (err) {
            expectedError = err;
        }
        should.exist(expectedError, "Error should exist");
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.microsoft_user_details_missing_token_error.code);        
    });
    
    it('should throw an error when microsoft fails to retrieve username from access_token due missing system config', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        function microsoftLoginServiceMock() {

            this.getAccessToken = function () {
                return "foo_token"
            }

            this.getUserDetails = function () {
                throw new CustomError("foo system error",
                ApiResponseCodes.missing_system_configuration.code);
            }            
        }

        oauth2SpecService.microsoftLoginService = new microsoftLoginServiceMock();        

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromMicrosoftAuthCode("foo");
        } catch (err) {
            expectedError = err;
        }
        should.exist(expectedError, "Error should exist");
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);        
    });
    
    it('should return the token', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme",
                jwtMinutesExpiration: "5"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;        

        function microsoftLoginServiceMock() {

            this.getAccessToken = function () {
                return "foo_token"
            }

            this.getUserDetails = function () {
                return {
                    displayName: "Mr Foo",
                    mail: "foo@mocosoft.com"
                }
            }            
        }

        oauth2SpecService.microsoftLoginService = new microsoftLoginServiceMock();  

        function subjectDataServiceMock() {
            this.findSubjectByIdentifier = function () {
                return ["bar"];
            }
        }

        oauth2SpecService.subjectDataService = new subjectDataServiceMock();        

        var tokenResponse = await oauth2SpecService.generateTokenFromMicrosoftAuthCode("foo");
        should.exist(tokenResponse, "generateTokenFromMicrosoftAuthCode response should exist");        
        expect(tokenResponse.code).to.eql(ApiResponseCodes.success.code);
        should.exist(tokenResponse.content.access_token, "access_token should exist"); 
        should.exist(tokenResponse.content.expires_in, "expires_in should exist"); 
    });      

    // it('should return a custom error when system params are missing: jwtMinutesExpiration', async function() {
    //     var oauth2SpecService = new Oauth2SpecService();

    //     var configurationMock = {
    //         oauth2 : {
    //             jwtSecret: "changeme"
    //         },
    //         hasProperty: hasProperty
    //     };           
    //     oauth2SpecService.configuration = configurationMock;

    //     var expectedError;
    //     try {
    //         await oauth2SpecService.generateTokenFromSubject();
    //     } catch (err) {
    //         expectedError = err;
    //     }
    //     console.log(expectedError)
    //     expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);        
    // });  
    
    // it('should return a custom error when param is missing', async function() {
    //     var oauth2SpecService = new Oauth2SpecService();

    //     var configurationMock = {
    //         oauth2 : {
    //             jwtSecret: "changeme",
    //             jwtMinutesExpiration: "5"
    //         },
    //         hasProperty: hasProperty
    //     };           
    //     oauth2SpecService.configuration = configurationMock;

    //     var expectedError;
    //     try {
    //         await oauth2SpecService.generateTokenFromSubject();
    //     } catch (err) {
    //         expectedError = err;
    //     }
    //     console.log(expectedError)
    //     expect(expectedError.code).to.eql(ApiResponseCodes.bad_request_missing_field.code);        
    // });      


    // it('should return a custom error when user cannot be searched due to db error', async function() {
    //     var oauth2SpecService = new Oauth2SpecService();

    //     var configurationMock = {
    //         oauth2 : {
    //             jwtSecret: "changeme",
    //             jwtMinutesExpiration: "5"
    //         },
    //         hasProperty: hasProperty
    //     };           
    //     oauth2SpecService.configuration = configurationMock;

    //     function subjectDataServiceMock() {
    //         this.findSubjectByIdentifier = function () {
    //             throw new Error("Im a findSubjectByIdentifier error");
    //         }
    //     }

    //     oauth2SpecService.subjectDataService = new subjectDataServiceMock();

    //     var expectedError;
    //     try {
    //         await oauth2SpecService.generateTokenFromSubject("foo");
    //     } catch (err) {
    //         expectedError = err;
    //     }
    //     console.log(expectedError)
    //     expect(expectedError.code).to.eql(ApiResponseCodes.internal_error.code);        
    // });


    // it('should return a custom error when user was not found', async function() {
    //     var oauth2SpecService = new Oauth2SpecService();

    //     var configurationMock = {
    //         oauth2 : {
    //             jwtSecret: "changeme",
    //             jwtMinutesExpiration: "5"
    //         },
    //         hasProperty: hasProperty
    //     };           
    //     oauth2SpecService.configuration = configurationMock;

    //     function subjectDataServiceMock() {
    //         this.findSubjectByIdentifier = function () {
    //             return [];
    //         }
    //     }

    //     oauth2SpecService.subjectDataService = new subjectDataServiceMock();

    //     var expectedError;
    //     try {
    //         await oauth2SpecService.generateTokenFromSubject("foo");
    //     } catch (err) {
    //         expectedError = err;
    //     }
    //     console.log(expectedError)
    //     expect(expectedError.code).to.eql(ApiResponseCodes.user_not_found.code);        
    // });

    // it('should return the token info if everything works', async function() {
    //     var oauth2SpecService = new Oauth2SpecService();

    //     var configurationMock = {
    //         oauth2 : {
    //             jwtSecret: "changeme",
    //             jwtMinutesExpiration: "5"
    //         },
    //         hasProperty: hasProperty
    //     };           
    //     oauth2SpecService.configuration = configurationMock;

    //     function subjectDataServiceMock() {
    //         this.findSubjectByIdentifier = function () {
    //             return ["bar"];
    //         }
    //     }

    //     oauth2SpecService.subjectDataService = new subjectDataServiceMock();

    //     var response = await oauth2SpecService.generateTokenFromSubject("foo");        
    //     should.exist(response.access_token);
         
    // });    
});