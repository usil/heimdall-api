const include = require('nodejs-require-enhancer');
const chai = require('chai');
const expect = chai.expect;
const should = require('chai').should();
const Oauth2SpecService = include('/src/main/node/services/Oauth2SpecService.js');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');

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

describe('Oauth2SpecService : generateTokenFromSubject', function() {

    it('should return a custom error when system params are missing: jwtSecret', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            hasProperty: hasProperty
        };            
        oauth2SpecService.configuration = configurationMock;

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromSubject();
        } catch (err) {
            expectedError = err;
        }
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);        
    });

    it('should return a custom error when system params are missing: jwtMinutesExpiration', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromSubject();
        } catch (err) {
            expectedError = err;
        }
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.missing_system_configuration.code);        
    });  
    
    it('should return a custom error when param is missing', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme",
                jwtMinutesExpiration: "5"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromSubject();
        } catch (err) {
            expectedError = err;
        }
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.bad_request_missing_field.code);        
    });      


    it('should return a custom error when user cannot be searched due to db error', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme",
                jwtMinutesExpiration: "5"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;

        function subjectDataServiceMock() {
            this.findSubjectByIdentifier = function () {
                throw new Error("Im a findSubjectByIdentifier error");
            }
        }

        oauth2SpecService.subjectDataService = new subjectDataServiceMock();

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromSubject("foo");
        } catch (err) {
            expectedError = err;
        }
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.internal_error.code);        
    });


    it('should return a custom error when user was not found', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme",
                jwtMinutesExpiration: "5"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;

        function subjectDataServiceMock() {
            this.findSubjectByIdentifier = function () {
                return [];
            }
        }

        oauth2SpecService.subjectDataService = new subjectDataServiceMock();

        var expectedError;
        try {
            await oauth2SpecService.generateTokenFromSubject("foo");
        } catch (err) {
            expectedError = err;
        }
        console.log(expectedError)
        expect(expectedError.code).to.eql(ApiResponseCodes.user_not_found.code);        
    });

    it('should return the token info if everything works', async function() {
        var oauth2SpecService = new Oauth2SpecService();

        var configurationMock = {
            oauth2 : {
                jwtSecret: "changeme",
                jwtMinutesExpiration: "5"
            },
            hasProperty: hasProperty
        };           
        oauth2SpecService.configuration = configurationMock;

        function subjectDataServiceMock() {
            this.findSubjectByIdentifier = function () {
                return ["bar"];
            }
        }

        oauth2SpecService.subjectDataService = new subjectDataServiceMock();

        var response = await oauth2SpecService.generateTokenFromSubject("foo");        
        should.exist(response.access_token);
         
    });    
});