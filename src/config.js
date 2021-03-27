
module.exports = {
    port: 3000,
    timeout: 30000,
    waitUntil: 'networkidle0',
    width: 1920,
    height: 1080,
    isMobile: false,
    args: [
        '--no-sandbox'
    ],
    tokens: [],
    db: {
        url: "mongodb://localhost:27017",
        database: 'spar'
    },
    cacheLifetime: 1800
};
