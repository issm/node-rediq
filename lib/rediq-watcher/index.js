'use strict'

const Promise = require('bluebird')
const utils = require('../rediq/utils')
const Worker = require('../rediq-worker')

class Watcher {
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

    watch (opts = {}) {
        let isInit = typeof opts.init !== 'undefined' ? opts.init : true

        let {redis, target} = this
        let nextTick = 500

        if(isInit) {
            this._log('info', `start watching \`${target}\` ...`)
        }

        let wvSchema = { // wv: worker value
            type:     'object',
            required: [ 'id', 'params' ],
            properties: {
                id:     { type: 'string', example: 'foobar', description: '' },
                params: { type: 'object', example: {}, description: '' }
            }
        }

        return redis.brpopAsync(target, 0).then(([k, v]) => {
            try {
                let parsed = JSON.parse(v)
                let wvv = utils.validateWith(wvSchema, parsed)  // wvv: worker value validator
                v = parsed
            } catch(err) {
                // json error / validation error
                this._log('info', 'error: ' + v)

                return Promise.delay(nextTick).then(() => {
                    return this.watch({ init: false })
                })
            }

            // 管理モード
            if(v.id === '__admin') {
                let pr

                switch(v.params.command) {
                case 'exit':
                    this._log('info', 'exit')
                    pr = Promise.resolve(0)
                    break
                default:
                    this._log('info', 'unknown admin command')
                    pr = Promise.delay(nextTick).then(() => {
                        return this.watch({ init: false })
                    })
                }

                return pr
            }

            // 登録されている worker へ割り振る
            return this._dispatch(v)
                .then((result) => {
                    this._log('info', result)
                })
                .catch((err) => {
                    this._log('info', err.type)
                    if(err.stderr) { this._log('info', err.stderr) }
                })
                .finally(() => {
                    return Promise.delay(nextTick).then(() => {
                        return this.watch({ init: false })
                    })
                })
        })
    }

    _dispatch ({id, params}) {
        let worker = this._worker[id]

        if(!worker) {
            let err = new Error('unregistered worker')
            err.type = 'UnregisteredWorker'
            return Promise.reject(err)
        }

        let runOpts = { params: params }

        return worker.run(runOpts)
            .then((result) => {
                return Promise.resolve(result)
            })
            .catch((err) => {
                err.type = err.type ? `WorkerError:${err.type}` : 'WorkerError'
                return Promise.reject(err)
            })
    }

    _log (type, data) {
        console.log(data)
    }
}

module.exports = Watcher

