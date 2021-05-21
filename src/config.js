
module.exports = {
    port: 3000,
    timeout: 30000,
    waitUntil: 'networkidle0',
    width: 1920,
    height: 1080,
    isMobile: false,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Spar/1.0',
    args: [
        '--no-sandbox'
    ],
    db: {
        url: "mongodb://localhost:27017",
        database: 'spar'
    },
    cacheLifetime: 1800,
    noVerifyUserToken: true,
    encryption_key: '__some_random_text__'
};
