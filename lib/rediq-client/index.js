const utils = require('../rediq/utils')

class Client {
    constructor (opts = {}) {
        let schema = {
            required: [ 'target' ],
            properties: {
                target: { type: 'string', example: 'foobar', description: '' },
                redis: {
                    type: 'object',
                    properties: {
                        'host': { type: 'string', example: 'localhost' },
                        'port': { type: 'integer', example: 6379 },
                        'db':   { type: 'integer', example: 1 }
                    }
                }
            }
        }
        let v = utils.validateWith(schema, opts)

        this.redis = utils.createRedisClient(opts.redis)

        this.target = opts.target
    }

    enqueue (opts = {}) {
        let schema = {
            required: [ 'id', 'params' ],
            properties: {
                id:     { type: 'string', example: 'foobar', description: '' },
                params: { type: 'object', example: {}, description: '' }
            }
        }
        let v = utils.validateWith(schema, opts)

        let {redis, target} = this

        let wv = JSON.stringify({ // wv: worker value
            id:     opts.id,
            params: opts.params
        })

        return redis.lpushAsync(target, wv)
            .then((result) => {
                return Promise.resolve(result)
            })
            .catch((err) => {
                err.type = 'EnqueueFailure'
                return Promise.reject(err)
            })
    }
}

module.exports = Client
