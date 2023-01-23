var Query = require("query");

function project(obj, projection) {
    let projectedObj = {}
    for (let key in projection) {
        projectedObj[key] = obj[key];
    }
    return projectedObj;
}

var subscriptionKey = process.env.APIKEY ||  "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";

async function getContent(fetch, prompt) {
    const url = "https://api.openai.com/v1/completions"
    const request = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${subscriptionKey}`,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ "model": "text-davinci-003", "prompt": prompt, "temperature": 0.5, "max_tokens": 2048 })
    });
    const response = await request.json();

    return {
        original: prompt,
        result: response.choices[0].text.slice(2),
    }
}

async function getFirstTen(fetch) {
    const translationOne = await getContent(fetch, "Write an email about Templafy")
    try {
        return [translationOne];
    } catch (error) {
        console.log(error);
    }
}

async function getSingle(fetch, translation) {
    try {
        const result = await getContent(fetch, translation);
        return result
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