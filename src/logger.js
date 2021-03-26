const formatUnicorn = require('./format-unicorn');

module.exports = {
    log: (message, variables) => {
        console.log(`${ new Date().toUTCString() }: ${ formatUnicorn(message, variables) }`);
    }
}
