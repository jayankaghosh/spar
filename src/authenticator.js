const { tokens } = require('./config');

module.exports = {
    authenticate: req => {
        const token = req.header('X-Spar-Token');
        if (!token || !tokens.includes(token)) {
            throw `Invalid token`;
        }
        return {
            token
        }
    }
}
