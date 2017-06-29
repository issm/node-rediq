const utils = require('rediq/utils')

class Watcher {
    constructor (opts = {}) {
        this.redis = utils.createRedisClient()
    }

    // register (opts = {}) {
    // }

    // watch (opts = {}) {
    // }
}

module.exports = Watcher

