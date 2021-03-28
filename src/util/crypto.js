const config = require('../config');
const crypto = require('crypto');

const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');

class Crypto {

    generateToken(size = 8) {
        return crypto.randomBytes(size).toString('hex');
    }

    hash(plainText, salt) {
        if (!salt) {
            salt = config.encryption_key;
        }
        return sha256(`${salt}${plainText}${salt}`);
    }

    verify(plainText, hash, salt) {
        return this.hash(plainText, salt) === hash;
    }

}

module.exports = new Crypto();
