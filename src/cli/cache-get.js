const db = require('../db');
const logger = require('../logger');
const { ask }  = require('../util/cli');
const PageCache = require('../util/page-cache');

class CacheGet {
    async execute() {
        const domain = ask('Domain');
        const cacheHelper = new PageCache();
        const caches = await cacheHelper.get({ url: domain });
        logger.log(JSON.stringify(caches.map(({ id: url }) => ({ url }))));
        return true;
    }

}

(async () => {
    try {
        const cacheGet = new CacheGet();
        await cacheGet.execute();
    } catch (e) {
        logger.log(e);
    } finally {
        await db.disconnect();
    }
})();
