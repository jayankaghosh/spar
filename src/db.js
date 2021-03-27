const config = require('./config');
const { MongoClient } = require('mongodb');
const collectionTypes = require('./collection.types');

class Database {

    constructor() {
        this.db = null;
        this.client = null;
    }

    getCollectionTypes() {
        return collectionTypes;
    }

    async connect () {
        if (!this.db) {
            this.client = await MongoClient.connect(config.db.url, { useUnifiedTopology: true });
            this.db = await this.client.db(config.db.database);
        }
        return this.db;
    }

    async disconnect() {
        await this.client.close();
        this.db = this.client = null;
        return this;
    }

    async findById(collection, id) {
        return this.find(collection, { id });
    }

    async find(collection, query) {
        const db = await this.connect();
        const record = await db.collection(collection).findOne(query);
        return record;
    }

    async findAll(collection, query) {
        const db = await this.connect();
        const records = await db.collection(collection).find(query).toArray();
        return records;
    }

    async save(collection, document, lifetime) {
        const db = await this.connect();
        const query = { id: document.id };
        if (!lifetime) {
            lifetime = config.cacheLifetime;
        }
        document.created_at = new Date().getTime();
        document.expires_at = document.created_at + (lifetime * 1000);
        const update = { $set: document};
        const options = { upsert: true };
        await db.collection(collection).updateOne(query, update, options);
        return document;
    }

    async delete(collection, query) {
        const db = await this.connect();
        await db.collection(collection).deleteMany(query);
        return this;
    }

}


module.exports = new Database();
