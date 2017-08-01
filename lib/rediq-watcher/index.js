const utils = require('rediq/utils')

class Watcher {
    constructor (opts = {}) {
        let schema = {
            required: [ 'target' ],
            properties: {
                target: { type: 'string', example: 'foobar', description: '' }
            }
        }
        let v = utils.validateWith(schema, opts)

        this.redis = utils.createRedisClient()
    }

    // register (opts = {}) {
    // }

    // watch (opts = {}) {
    // }
}

module.exports = Watcher

