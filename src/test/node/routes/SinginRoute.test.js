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

    test('should return the html of login page', async function () {

        var configurationMock = {
            login : {engine : "default"},
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
        app.get("/v1/sing-in/default", singinRoute.getDefaultLogin)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/sing-in/default');
        expect(response.status).to.eql(200);
        expect(response.text.includes("/v1/sing-in/default")).to.eql(true);
        expect(response.text.includes('name="username"')).to.eql(true);
        expect(response.text.includes('name="password"')).to.eql(true);
    });


    test('should return 500 and error code on missing configurations', async function () {

        var configurationMock = {
            login : {engine : "default"},
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
        expect(response.status).to.eql(500);
        //#TODO regex to get the error code  
        expect(response.text.includes("Error Code:")).to.eql(true);        
    });

    test('should return 200 and the access_token as query param', async function () {

        var configurationMock = {
            login: {
                "engine": "default",
                "default": {
                  "redirectWebBaseurl": "www.foo.com"
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

        var singinRoute = new SinginRoute();
        singinRoute.configuration = configurationMock;

        function oauth2SpecServiceMock() {
            this.generateToken = function () {

                return {
                    code: 200000,
                    message: "success",
                    content: {
                        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
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
        expect(response.status).to.eql(302);
        expect(response.headers.location.trim()).to.eql("www.foo.com/default/callback?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    });    

});