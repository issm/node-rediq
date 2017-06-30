const Base = require('./Base')

const WORKER_TYPE = 'exec'

class Exec extends Base {
    constructor (opts = {}) {
        super(opts)
        this.type = WORKER_TYPE
    }
}

module.exports = Exec
