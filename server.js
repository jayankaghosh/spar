const pkg = require('./package');
const express = require('express');
const app = express();
const config = require('./src/config');
const logger = require('./src/logger');
const renderer = require('./src/renderer');
const rendererConfig = require('./src/renderer-config');
const authenticator = require('./src/authenticator');
const ApiRouter = require('./src/api');
const db = require('./src/db');

const sendResponse = (res, code, headers, body) => {
    res.status(code);
    res.set(headers);
    res.end(body.toString());
}

app.get('/admin*', async (req, res) => {
    res.send('admin');
});

app.all('/api*', async (req, res) => {
    try {
        const { code, response } = await ApiRouter.route(req.path.substring('/api'.length), req.method, req);
        sendResponse(res, code, {
            'content-type': 'application/json'
        }, JSON.stringify(response));
    } catch ({ code, response }) {
        sendResponse(res, code, {
            'content-type': 'application/json'
        }, JSON.stringify(response));
    }
});

app.get('*', async (req, res) => {

    try {
        const user = authenticator.authenticate(req);
        const url = req.originalUrl.substring(1);
        logger.log(`> [${ user.token }] ${ req.method } ${ url } START`);


        const pageCacheCollection = db.getCollectionTypes().PAGE_CACHE;
        let result = await db.findById(pageCacheCollection, url);
        let response = {};
        if (result) {
            logger.log(`> [${ user.token }] ${ req.method } ${ url } CACHE FOUND`);
            response = result.response;
        } else {
            logger.log(`> [${ user.token }] ${ req.method } ${ url } CACHE NOT FOUND. RENDERING`);
            response = await renderer.render(url, rendererConfig(user, config));
            const headers = response.headers;
            response.headers = {
                'X-Powered-By': pkg.name,
                'Content-Type': headers['content-type'] || 'text/html',
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
            };
            if (response.statusCode >= 200 && response.statusCode < 300) {
                db.save(pageCacheCollection, {
                    id: url,
                    response
                });
            }
        }

        sendResponse(
            res,
            response.statusCode || 500,
            response.headers,
            response.content || ''
        );

        logger.log(`> [${ user.token }] ${ req.method } ${ url } STOP (${ response.statusCode })`);
    } catch (e) {
        logger.log(`> ${ e }`);
        sendResponse(res, 401, {
            'Content-Type': 'text/plain'
        }, e);
    }
});

app.listen(config.port, () => {
    logger.log(`${ pkg.name.toUpperCase() } listening at http://localhost:${ config.port }`)
});
