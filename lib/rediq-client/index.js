const utils = require('rediq/utils')

class Client {
    constructor (opts = {}) {
        this.redis = utils.createRedisClient()
    }

    // enqueue (opts = {}) {
    // }
}

module.exports = Client
