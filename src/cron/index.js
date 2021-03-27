const db = require('../db');
const logger = require('../logger');

class Cron {

    async flushPageCache() {
        const records = await db.findAll(db.getCollectionTypes().PAGE_CACHE, {});
        const now = new Date().getTime();
        const idsToDelete = [];
        records.forEach(async record => {
            if (now >= record.expires_at) {
                idsToDelete.push(record.id);
            }
        });
        if (idsToDelete > 0) {
            await db.delete(db.getCollectionTypes().PAGE_CACHE, { id: { $in: idsToDelete } });
            logger.log(`Deleted URLs\n${ idsToDelete.join('\n') }`)
        } else {
            logger.log(`No URLs expired`);
        }
        db.disconnect();
    }

    run() {
        return this.flushPageCache();
    }

}

(() => {
    const cron = new Cron();
    cron.run();
})();
