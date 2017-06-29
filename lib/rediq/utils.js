const _ = require('lodash')
const config = require('config')
const redis = require('redis')
const Promise = require('bluebird')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

class Utils {
    static createRedisClient (opts = {}) {
        let redisOptions = _.defaults(config.redis, opts)
        let client = redis.createClient(redisOptions)
        return client
    }
}

module.exports = Utils
