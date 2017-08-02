const _ = require('lodash')

const ENV = process.env
const REDIS_DEFAULTS = {
    host: 'localhost',
    port: 6379,
    db:   1
}

let config = {
    'redis': _.defaults({
        host: ENV.REDIQ_REDIS_HOST || ENV.REDIS_HOST,
        port: ENV.REDIQ_REDIS_PORT || ENV.REDIS_PORT,
        db:   ENV.REDIQ_REDIS_DB || ENV.REDIS_DB
    }, REDIS_DEFAULTS)
}

module.exports = config
