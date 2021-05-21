const db = require('../db');
const logger = require('../logger');
const { ask }  = require('../util/cli');
const PageCache = require('../util/page-cache');

class CacheDelete {
    async execute() {
        let url = ask('URL');
        const cacheHelper = new PageCache();
        await cacheHelper.delete({ url });
        logger.log(`Done`);
        return true;
    }
}

(async () => {
    try {
        const cacheGet = new CacheDelete();
        await cacheGet.execute();
    } catch (e) {
        logger.log(e);
    } finally {
        await db.disconnect();
    }
})();
