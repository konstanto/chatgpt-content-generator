var Query = require("query");

function project(obj, projection) {
    let projectedObj = {}
    for (let key in projection) {
        projectedObj[key] = obj[key];
    }
    return projectedObj;
}

async function getFirstTen(fetch) {
    try {
        const url = `https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=vE4hUUHUa4kO58E4N8prNuo6O5bdlvmF`;
        const request = await fetch(url);
        const response = await request.json();
        return response.results;
    } catch (error) {
        console.log(error);
    }
}

async function getSingle(fetch, id) {
    try {
        const url = `https://api.polygon.io/v3/reference/tickers/${id}?apiKey=vE4hUUHUa4kO58E4N8prNuo6O5bdlvmF`;
        const request = await fetch(url);
        const response = await request.json();
        var results = response.results;
        results.logo_url = results.branding.logo_url + "?apiKey=vE4hUUHUa4kO58E4N8prNuo6O5bdlvmF";
        results.icon_url = results.branding.icon_url + "?apiKey=vE4hUUHUa4kO58E4N8prNuo6O5bdlvmF";
        return results;
    } catch (error) {
        console.log(error);
    }
}

function query(fetch) {
    return async function(collection, query, req, cb) {
        if (query.$filter && query.$top != null) {
            return cb(null, await getFirstTen(fetch))
        }

        if (query.$filter && query.$filter._id != null) {
            return cb(null, await getSingle(fetch, query.$filter._id))
        }

        if (query.$select && Object.keys(query.$select).length > 0 && query.$select.constructor === Object) {
            qr = qr.map(d => project(d, query.$select))
        }

        return cb(null, qr);
    }
}

module.exports = function(db) {
    return odataServer => {
        odataServer.query(query(db))
    }
}