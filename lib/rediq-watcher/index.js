'use strict'

const Promise = require('bluebird')
const utils = require('rediq/utils')
const Worker = require('rediq-worker')

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
        this._worker = {}

        this.target = opts.target
    }

    register (opts = {}) {
        let schema = {
            oneOf: [
                // type-specified
                {
                    required: [ 'type' ],
                    properties: {
                        'type': { type: 'string', example: 'exec', description: '' },
                        'id':   { type: 'string', example: 'foobar', description: '' },
                        'opts': { type: 'object', example: {}, description: '' }
                    }
                },
                // worker-specified
                {
                    required: [ 'worker' ],
                    properties: {
                        'worker': {
                            type: 'object',
                            required: [ 'type', 'run' ],
                            properties: {
                                'type': { type: 'string', example: 'foobar', description: '' },
                                'run':  { description: 'should be a method/function' }
                            }
                        },
                        'id':   { type: 'string', example: 'foobar', description: '' }
                    }
                }
            ]
        }
        let v = utils.validateWith(schema, opts)

        let type = opts.type || opts.worker.type
        let id = opts.id || type

        if(typeof this._worker[id] !== 'undefined') {
            let err = new Error('worker id is duplicated')
            err.tpye = 'DuplicatedWorkerId'
            return Promise.reject(err)
        }

        let worker
        if(opts.type) {
            worker = Worker.create(opts.type, opts.opts)
        } else if(opts.worker) {
            worker = opts.worker
        }

        this._worker[id] = worker

        return Promise.resolve(id)
    }

    // watch (opts = {}) {
    // }
}

module.exports = Watcher

