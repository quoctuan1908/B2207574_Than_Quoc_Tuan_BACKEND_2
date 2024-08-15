require('dotenv').config();

const config = {
    app: {
        port: 3000 || process.env.port
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog"
    }
}

module.exports = config;