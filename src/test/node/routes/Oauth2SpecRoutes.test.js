const include = require('nodejs-require-enhancer');
const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var bodyParser = require('body-parser');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
const express = require('express');
const request = require('supertest');
const http = require('http');

const Oauth2SpecRoutes = include('/src/main/node/routes/Oauth2SpecRoutes.js');

describe('Oauth2SpecRoutes', function () {

    var server;

    afterEach(async () => {
        await server.close();
    });

    test('return the authorize url for default engine', async function () {

        var configurationMock = {
            login: {
                engine: "default",
                default: {
                    "redirectWebBaseurl": "foo",
                    "authorizeUrl": "/v1/sing-in/default"
                }
            },
            getProperty: function (key) {
                try {
                    return key.split(".").reduce((result, key) => {
                        return result[key]
                    }, this);
                } catch (err) {
                    console.log(key + " cannot be retrieved from configuration!!!")
                }
            }
        }

        var oauth2SpecRoutes = new Oauth2SpecRoutes();
        oauth2SpecRoutes.configuration = configurationMock;

        const app = express();
        server = http.createServer(app);
        app.get("/v1/oauth2/authorize-url", oauth2SpecRoutes.getAuthorizeUrl)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/oauth2/authorize-url');
        console.log(response.text)

        expect(response.status).to.eql(200);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.content.engine).to.eql("default");
        expect(responseObject.content.authorizeUrl).to.eql("/v1/sing-in/default");
    }); 


    test('return the token from microsoft auth code', async function () {

        function oauth2SpecServiceMock() {
            this.generateTokenFromMicrosoftAuthCode = function () {
                return {
                    code: 200000,
                    message: "success",
                    content: {
                        access_token: "*****",
                        expires_in: 2600
                    }
                };
            }
        }

        var oauth2SpecRoutes = new Oauth2SpecRoutes();
        oauth2SpecRoutes.oauth2SpecService = new oauth2SpecServiceMock();

        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        server = http.createServer(app);
        app.post("/v1/oauth2/token/microsoft-auth-code", oauth2SpecRoutes.generateTokenFromMicrosoftAuthCode)
        server.listen(0); //i dont know why is sync
        const response = await request(app).post('/v1/oauth2/token/microsoft-auth-code').set('Content-Type', 'application/json')
            .send({
                "code": "foo_code"
            });
        var responseObject = JSON.parse(response.text);
        should.exist(responseObject.content.access_token);        
    });     

});