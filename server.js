const pkg = require('./package');
const express = require('express');
const app = express();
const config = require('./src/config');
const logger = require('./src/logger');
const renderer = require('./src/renderer');
const rendererConfig = require('./src/renderer-config');
const authenticator = require('./src/authenticator');

const sendResponse = (res, code, headers, body) => {
    res.status(code);
    res.set({
	'X-Powered-By': pkg.name,
	'Content-Type': headers['content-type'] || 'text/html',
	'Content-Length': headers['content-length'] || body.length,
	'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });
    res.send(body);
}

app.get('*', async (req, res) => {
    try {
        const user = authenticator.authenticate(req);
        const url = req.path.substring(1);
        logger.log(`> [${ user.token }] ${ req.method } ${ url } START`);
        const response = await renderer.render(url, rendererConfig(config));
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
