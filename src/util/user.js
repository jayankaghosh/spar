const db = require('../db');
const logger = require('../logger');
const { hash, generateToken }  = require('../util/crypto');

const userCollectionName = db.getCollectionTypes().USERS;

class User {

    async create({ firstName, lastName, email, password }) {
        await this.validate({firstName, lastName, email, password});
        await db.save(userCollectionName, {
            id: email,
            firstName,
            lastName,
            email,
            password: hash(password)
        });
        await this.generateToken(email);
        return this.getByEmail(email);
    }

    async getByEmail(email) {
        const user = await db.find(userCollectionName, { email });
        if (!user) {
            throw `User with email "${ email }" does not exist`;
        }
        return user;
    }

    async generateToken(email) {
        const user = await this.getByEmail(email);
        if (!user.tokens) {
            user.tokens = [];
        }
        const token = generateToken();
        user.tokens.push({
            token,
            created_at: new Date().getTime()
        });
        await db.save(userCollectionName, user);
        logger.log(`Token "${ token }" generated for user "${ email }"`)
        return user;
    }

    async validate(data) {
        const existingUser = await db.find(userCollectionName, { email: data.email });
        if (existingUser) {
            throw `User with the same email "${ data.email }" already exists`;
        }
    }

}

module.exports = User;
