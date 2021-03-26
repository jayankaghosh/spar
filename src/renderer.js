const puppeteer = require('puppeteer-core');
const defaultErrorPage = require('./default-error-page');
const formatUnicorn = require('./format-unicorn');

class Renderer {

    render (url, config) {
        return new Promise(async (resolve) => {
            try {
                if (!url.length) {
                    throw 'URL not specified';
                }
                const browser = await puppeteer.launch({
                    args: config.args,
                    executablePath: '/usr/bin/chromium-browser',
                    headless: true
                });
                const page = await browser.newPage();
                await page.setViewport({
                    width: config.width,
                    height: config.height,
                    isMobile: config.isMobile,
                });
                const response = await page.goto(url,  {
                    timeout: config.timeout,
                    waitUntil: config.waitUntil,
                });
                await Promise.all(config.evaluate.map(evaluator => page.evaluate(evaluator, {
                    url
                })));

                // Set status to the initial server's response code. Check for a <meta
                // name="render:status_code" content="4xx" /> tag which overrides the status
                // On a repeat visit to the same origin, browser cache is enabled, so we may
                // code.
                let statusCode = response.status();
                // encounter a 304 Not Modified. Instead we'll treat this as a 200 OK.
                if (statusCode === 304) {
                    statusCode = 200;
                }

                const headers = response.headers();

                const result = await page.content();

                browser.close();

                return resolve({
                    headers,
                    statusCode,
                    content: result
                });
            } catch(error) {
                return resolve({
                    headers: {},
                    content: formatUnicorn(defaultErrorPage, { error: error.toString(),  url }),
                    statusCode: 500
                });
            }
        });
    }

}


module.exports = new Renderer();
