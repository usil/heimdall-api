const include = require('nodejs-require-enhancer');
const _ = process.env.npm_config_local_prefix;
var chai = require('chai');
const fsPromises = require('fs').promises
var expect = chai.expect;
var assert = chai.assert;
var HeimdallApiHelper = include('/src/main/node/common/HeimdallApiHelper.js');

describe('HeimdallApiHelper : getPermissionsByStringRoute', function() {

    it('should get return the permission by route', async function() {
        var heimdallApiHelper = new HeimdallApiHelper();
        let rawJSon = await fsPromises.readFile(__dirname + "/HeimdallApiHelper.test_dependenciesWithProtected.json", 'utf-8')
        var permissionsByStringRoute = heimdallApiHelper.getPermissionsByStringRoute(JSON.parse(rawJSon));
        expect(permissionsByStringRoute["/v1/oauth2/token"]).to.eql('dddd:eeee:fffff');
        expect(permissionsByStringRoute["/v1/oauth2/subject"]).to.eql('aaaaa:bbbb:cccccc');
    });

    it('should get return empty if @Protected is not used', async function() {
        var heimdallApiHelper = new HeimdallApiHelper();
        var permissionsByStringRoute = heimdallApiHelper.getPermissionsByStringRoute(JSON.parse("[]"));
        expect(Object.keys(permissionsByStringRoute).length).to.eql(0);        
    });


    it('should get return a custom error on exception', async function() {
        var heimdallApiHelper = new HeimdallApiHelper();
        try{
            var permissionsByStringRoute = heimdallApiHelper.getPermissionsByStringRoute(JSON.parse("{}"));
        }catch(err){
            expect(err.code>0).to.eql(true);
        }
    });    


});