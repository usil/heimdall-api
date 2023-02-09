const include = require('nodejs-require-enhancer');
const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var bodyParser = require('body-parser');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var resolveOrigin = require.resolve
var requireOrigin = require
var sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const SinginRoute = include('/src/main/node/routes/SinginRoute.js');

describe('SinginRoute', function () {

    var server;

    afterEach(async () => {
        await server.close();
    });

    it('return the default login url if engine is default', async function () {

        var configurationMock = {
            login: {
                engine: "default"
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

        var singinRoute = new SinginRoute();
        singinRoute.configuration = configurationMock;

        const app = express();
        server = http.createServer(app);
        app.get("/v1/sing-in/url-details", singinRoute.getSignInUrlDetails)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/sing-in/url-details');

        expect(response.status).to.eql(200);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.content.engine).to.eql("default");
        expect(responseObject.content.url).to.eql("/v1/sing-in/default");
    });


    it('should return the html of login page', async function () {

        var singinRoute = new SinginRoute();

        const app = express();
        server = http.createServer(app);
        app.get("/v1/sing-in/default", singinRoute.getDefaultLogin)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/sing-in/default');
        expect(response.status).to.eql(200);
        expect(response.text.includes("/v1/sing-in/default")).to.eql(true);
        expect(response.text.includes('name="username"')).to.eql(true);
        expect(response.text.includes('name="password"')).to.eql(true);
    });


    it.only('should return 200 and the access_token as header after login', async function () {

        var singinRoute = new SinginRoute();

        function oauth2SpecServiceMock() {
            this.generateToken = function () {

                return {
                    code: 200000,
                    message: "success",
                    content: {
                        access_token: "access_token_foo",
                        expires_in: "3600s"
                    }
                };
            }
        }

        singinRoute.oauth2SpecService = new oauth2SpecServiceMock();

        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));    
        server = http.createServer(app);
        app.post("/v1/sing-in/default", singinRoute.processDefaultLogin)
        server.listen(0); //i dont know why is sync
        const response = await request(app).post('/v1/sing-in/default').set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                "grant_type": "password",
                "username": "foo1",
                "password": "bar1"
              });
        console.log(response.text);
        expect(response.status).to.eql(200);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.code).to.eql(200000);
        expect(responseObject.content.access_token).to.eql("access_token_foo");
    });

});