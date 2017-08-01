const utils = require('rediq/utils')

class Client {
    constructor (opts = {}) {
        let schema = {
            required: [ 'target' ],
            properties: {
                target: { type: 'string', example: 'foobar', description: '' }
            }
        }
        let v = utils.validateWith(schema, opts)

        this.redis = utils.createRedisClient()

        this.target = opts.target
    }

    // enqueue (opts = {}) {
    // }
}

module.exports = Client
