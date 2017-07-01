const Promise = require('bluebird')

const WORKER_TYPE = 'base'

class Base {
    constructor (opts = {}) {
        this.type = WORKER_TYPE
        this.Promise = this.Pr = Promise
    }

    run (opts = {}) {
        let schema = {
            properties: {
                params: { type: 'object', example: {}, description: '' }
            }
        }

        let err = new Error('should be overridden')
        err.type = 'NotBeOverridden'
        return this.Promise.reject(err)
    }
}

module.exports = Base
