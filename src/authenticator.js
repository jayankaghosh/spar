const { tokens } = require('./config');
const db = require('./db');
const userCollectionName = db.getCollectionTypes().USERS;

module.exports = {
    authenticate: async req => {
        const token = req.header('X-Spar-Token');
        const user = await db.find(userCollectionName, { tokens: { $elemMatch: { token } } });
        if (!user) {
            throw `Invalid token`;
        }
        return {
            ...user,
            matchedToken: token
        }
    }
}
