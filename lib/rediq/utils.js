const _ = require('lodash')
const config = require('config')
const redis = require('redis')
const Ajv = require('ajv')
const Promise = require('bluebird')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

class Utils {
    static createRedisClient (opts = {}) {
        let redisOptions = _.defaults(opts, config.redis)
        let client = redis.createClient(redisOptions)
        return client
    }

    static validateWith (schema, data, opts = {}) {
        let argsSchema = {
            opts: {
                required: [],
                properties: {
                    promise: { type: 'boolean', example: true, description: 'Promiseオブジェクトとして返すかどうか' }
                }
            }
        }

        let isPromise = opts.promise || false
        let v, isValid, err

        v = new Ajv()
        isValid = v.validate(schema, data)

        if(!isValid) {
            err = new Error('validation failure')
            err.type = 'ValidationFailure'
            err.errors = v.errors
            err._ajv = v
        }

        let result = {
            valid:  isValid,
            errors: v.errors,
            _ajv:   v
        }

        if(isPromise) {
            let pr = err ? Promise.reject(err) : Promise.resolve(result)
            return pr
        } else {
            if(err) { throw err }
            else    { return result }
        }
    }
}

module.exports = Utils
