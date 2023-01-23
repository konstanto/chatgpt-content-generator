var http = require('http');
var ODataServer = require('simple-odata-server');
var Adapter = require('./dataAdapter');
const fetch = require('node-fetch');

const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

var model = {
    namespace: "jsreport",
    entityTypes: {
        "Company": {
            "ticker": { "type": "Edm.String", key: true },
            "name": { "type": "Edm.String" },
            "market": { "type": "Edm.String" },
            "marketprimary_exchange": { "type": "Edm.String" },
            "type": { "type": "Edm.String" },
            "currency_name": { "type": "Edm.String" },
            "cik": { "type": "Edm.String" },
            "composite_figi": { "type": "Edm.String" },
            "share_class_figi": { "type": "Edm.String" },
            "market_cap": { "type": "Edm.String" },
            "phone_number": { "type": "Edm.String" },
            "description": { "type": "Edm.String" },
            "sic_code": { "type": "Edm.String" },
            "sic_descriotion": { "type": "Edm.String" },
            "ticker_root": { "type": "Edm.String" },
            "homepage_url": { "type": "Edm.String" },
            "total_employees": { "type": "Edm.String" },
            "list_date": { "type": "Edm.String" },
            "logo_url": { "type": "Edm.String" },
            "icon_url": { "type": "Edm.String" },
        }
    },
    entitySets: {
        "companies": {
            entityType: "jsreport.Company"
        }
    }
};

var odataServer = ODataServer("http://localhost:1337")
    .model(model)
    .adapter(Adapter(fetch));

http.createServer(odataServer.handle.bind(odataServer)).listen(1337);