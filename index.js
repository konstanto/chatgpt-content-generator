var http = require('http');
var ODataServer = require('simple-odata-server');
var Adapter = require('./dataAdapter');
const fetch = require('node-fetch');
var dotenv = require("dotenv");

const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

dotenv.config();

var model = {
    namespace: "jsreport",
    entityTypes: {
        "generation": {
            "original": { "type": "Edm.String", key: true },
            "result": { "type": "Edm.String" }
        }
    },
    entitySets: {
        "generations": {
            entityType: "jsreport.generation"
        }
    }
};

var odataServer = ODataServer(process.env.URL ||  "http://localhost:1337")
    .model(model)
    .adapter(Adapter(fetch));

http.createServer(odataServer.handle.bind(odataServer)).listen(1337);