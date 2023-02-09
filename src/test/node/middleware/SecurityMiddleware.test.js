const include = require('nodejs-require-enhancer');
const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
const jwt = require('jsonwebtoken')
const request = require('supertest');
const fsPromises = require('fs').promises

const SecurityMiddleware = include("/src/main/node/middleware/SecurityMiddleware.js");
const TestHelper = include('/src/test/node/test/TestHelper.js')

describe('SecurityMiddleware: ensureAuthorization', function() {

  var ligthExpress;

  afterEach(async () => {
    await ligthExpress.server.close();
  });

    test('should return 500 on missing oauth2.jwtSecret', async function() {
    var configuration = {}
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configure();
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response = await request(ligthExpress.app).post('/foo/bar');
    expect(response.status).to.equal(500);
  });

    test('should ignore the security if route is not Protected', async function() {
    var configuration = {
      oauth2: {
        jwtSecret: "theprecious"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse("[]");
    securityMiddleware.configuration = configuration;
    securityMiddleware.configure();
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response = await request(ligthExpress.app).post('/foo/bar');
    console.log(response.text)
    expect(response.status).to.equal(200);
    expect(response.text).to.equal("im the protected");
  });

    test('should return 401 [Missing token] on missing bearer token', async function() {
    var configuration = {
      oauth2: {
        jwtSecret: "theprecious"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response = await request(ligthExpress.app).post('/foo/bar');
    expect(response.status).to.equal(401);
  });
    test('should return 401 [Token should be Bearer] on wrong bearer token syntax', async function() {
    var configuration = {
      oauth2: {
        jwtSecret: "theprecious"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response = await request(ligthExpress.app).post('/foo/bar');
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': 'foobarbaz'});
    expect(response1.status).to.equal(401)

    const response2 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': 'foo bar'});
    expect(response2.status).to.equal(401)

  });
    test('should return 401 [Invalid token] on malformed bearer token', async function() {
    var configuration = {
      oauth2: {
        jwtSecret: "theprecious"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': 'Bearer 123456789'});;
    expect(response1.status).to.equal(401)
  });
    test('should return 403 when token is valid but there is a db error or unknown subject', async function() {

    var token1 = jwt.sign({
      subject_identifier: "jane_doe"
    }, "secret", {
      expiresIn: '3600s'
    });
    var token2 = jwt.sign({
      subject_identifier: "kurt_weller"
    }, "secret", {
      expiresIn: '3600s'
    });

    var req1 = {};
    req1.headers = {
      authorization: "Bearer " + token1
    };
    var req2 = {};
    req2.headers = {
      authorization: "Bearer " + token2
    };
    var res = function() {
      this.json = function(data) {
        return data;
      }
      this.status = function(status) {
      }
    }
    var configuration = {
      oauth2: {
        jwtSecret: "secret"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token1});
    expect(response1.status).to.equal(403)
    const response2 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token2});
    expect(response2.status).to.equal(403)

  });
    test('should return 403 on valid token and valid subject but without permission', async function() {

    var token = jwt.sign({
      subject_identifier: "jane_doe"
    }, "secret", {
      expiresIn: '3600s'
    });

    var configuration = {
      nodeboot: {
        iam_oauth2_elementary_starter: {
          jwtSecret: "secret"
        }
      }
    }

    function permissionServiceMock() {
      this.hasPermissions = function() {
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
    }

    function subjectServiceMock() {
      this.findByIdentifier = function(identifier) {
        return new Promise((resolve, reject) => {
          resolve([{
            role: "foo"
          }])
        })
      }
    }

    var subjectService = new subjectServiceMock();
    var permissionService = new permissionServiceMock();
    
    var configuration = {
      oauth2: {
        jwtSecret: "secret"
      }
    }
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.subjectService = subjectService;
    securityMiddleware.permissionService = permissionService;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token});
    var responseTextAsObject = JSON.parse(response1.text);
    expect(responseTextAsObject.code).to.equal(403003);

  });

    test('should return 403 on valid token with lltu != registered in db', async function() {

    var token = jwt.sign({
      subject_identifier: "jane_doe",
      lltu: "im-the-fake-lltu",
    }, "secret", {
      expiresIn: '3600s'
    });

    var configuration = {
      oauth2: {
        jwtSecret: "secret"
      }
    }

    function permissionServiceMock() {
      this.hasPermissions = function() {
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
    }

    function subjectServiceMock() {
      this.findByIdentifier = function(identifier) {
        return new Promise((resolve, reject) => {
          resolve([{
            role: "foo",
            longLiveTokenUuid: "javadabadoo",
          }])
        })
      }
    }

    var subjectService = new subjectServiceMock();
    var permissionService = new permissionServiceMock();
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.subjectService = subjectService;
    securityMiddleware.permissionService = permissionService;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token});
    var responseTextAsObject = JSON.parse(response1.text);
    expect(responseTextAsObject.code).to.equal(403004);

  });


    test('should get the protected resource on valid token and valid subject with permission', async function() {

    var token = jwt.sign({
      subject_identifier: "jane_doe"
    }, "secret", {
      expiresIn: '3600s'
    });

    var configuration = {
      oauth2: {
        jwtSecret: "secret"
      }
    }

    function permissionServiceMock() {
      this.hasPermissions = function() {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }
    }

    function subjectServiceMock() {
      this.findByIdentifier = function(identifier) {
        return new Promise((resolve, reject) => {
          resolve([{
            role: "foo",
            longLiveTokenUuid: "javadabadoo",
          }])
        })
      }
    }

    var subjectService = new subjectServiceMock();
    var permissionService = new permissionServiceMock();
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.subjectService = subjectService;
    securityMiddleware.permissionService = permissionService;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token});
    expect(response1.status).to.equal(200);
    expect(response1.text).to.equal("im the protected");

  });

    test('should get the protected resource on valid long live token and valid subject with permission', async function() {

    var token = jwt.sign({
      subject_identifier: "jane_doe",
      lltu: "javadabadoo",
    }, "secret", {
      expiresIn: '3600s'
    });

    var configuration = {
      oauth2: {
        jwtSecret: "secret"
      }
    }

    function permissionServiceMock() {
      this.hasPermissions = function() {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }
    }

    function subjectServiceMock() {
      this.findByIdentifier = function(identifier) {
        return new Promise((resolve, reject) => {
          resolve([{
            role: "foo",
            longLiveTokenUuid: "javadabadoo",
          }])
        })
      }
    }

    var subjectService = new subjectServiceMock();
    var permissionService = new permissionServiceMock();
    var securityMiddleware = new SecurityMiddleware();
    ligthExpress = await TestHelper.createLigthExpress();
    let rawJSon = await fsPromises.readFile(__dirname + "/SecurityMiddleware.test_dependenciesWithProtected.json", 'utf-8')
    securityMiddleware.express  = ligthExpress.app;
    securityMiddleware.rawDependencies = JSON.parse(rawJSon);
    securityMiddleware.configuration = configuration;
    securityMiddleware.subjectService = subjectService;
    securityMiddleware.permissionService = permissionService;
    securityMiddleware.configure();    
    ligthExpress.app.post("/foo/bar", function(req, res){
      return res.send("im the protected")
    })
    const response1 = await request(ligthExpress.app).post('/foo/bar').set({ 'Authorization': "Bearer " + token});
    expect(response1.status).to.equal(200);
    expect(response1.text).to.equal("im the protected");

  });

});
