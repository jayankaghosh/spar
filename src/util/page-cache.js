const db = require('../db');
const logger = require('../logger');

const pageCacheCollectionName = db.getCollectionTypes().PAGE_CACHE;

class PageCache {

    escapeStringRegexp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    get({ url }) {
        return new Promise((async (resolve, reject) => {
            url = new URL(url);
            const origin = this.escapeStringRegexp(url.origin);
            try {
                const documents = await db.findAll(pageCacheCollectionName, { id: new RegExp(origin) });
                resolve(documents);
            } catch (e) {
                reject(e)
            }
        }));
    }

    delete({ url }) {
        return new Promise((async (resolve, reject) => {
            try {
                url = this.escapeStringRegexp(url);
                url = url.replace(/\\\*/g, '.*').replace(/\/+$/, '');
                await db.delete(pageCacheCollectionName, { id: new RegExp(`^${ url }$`) });
                resolve(true);
            } catch (e) {
                reject(e)
            }
        }));
    }

}

module.exports = PageCache;
