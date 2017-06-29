const _ = require('lodash')

const ENV = process.env
const REDIS_DEFAULTS = {
    host: 'localhost',
    port: 6379,
    db:   1
}

let config = {
    'redis': _.defaults({
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
        db:   ENV.REDIS_DB
    }, REDIS_DEFAULTS)
}

module.exports = config
