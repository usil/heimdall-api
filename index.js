require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs')

const dbConnectMongo = require('./config/mongo');
const { pingToUrl } = require('./utils/SchedulesJod');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());

app.use('/', require('./routes'))



app.listen(port, () => {
  console.log(`Exposed port for api : http://127.0.0.1:${port}`)
});

dbConnectMongo();

/**
 * Ping to web for test
 */
// pingToUrl('https://aj-derteano.github/')
// pingToUrl('https://aj-derteano.github.io/', null, true)

/**
 * read yaml
 */
let fileContent = fs.readFileSync('./config.yml', 'utf8')
let config = yaml.load(fileContent);

/* for (const web of config.url_webs) {
  const { url, expected_code, name } = web;
  pingToUrl({
    name,
    url,
    expected_code,
    cronExpression: config.cron_expression,
    printResultShell: true
  })
} */

/* const Webs = require('./controllers/Webs')
for (const web of config.url_webs) {
  const { url, expected_code, name, description } = web;
  let dataWeb = {
    webBaseUrl: url,
    name,
    description,
    expectResponseCode: expected_code
  }

  Webs.createWeb(dataWeb)
} */