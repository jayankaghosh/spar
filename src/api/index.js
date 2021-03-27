const Router = require('./Router');
const tokens = require('../config').tokens

const router = new Router();

router.addRoute({
    method: 'GET',
    route: '/getTokens',
    handler: {
        execute: (request) => {
            return {
                response: {
                    tokens
                }
            }
        }
    }
})

module.exports = router;
