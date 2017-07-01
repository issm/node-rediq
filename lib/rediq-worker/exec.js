const _ = require('lodash')
const {vsprintf} = require('sprintf-js')
const {exec} = require('child_process')
const utils = require('rediq/utils')
const Base = require('./Base')

const WORKER_TYPE = 'exec'

class Exec extends Base {
    constructor (opts = {}) {
        let schema = {
            required: [ 'command' ],
            properties: {
                command: { type: 'string', example: 'ls {path}', description: '' }
            }
        }
        let v = utils.validateWith(schema, opts)

        super(opts)
        this.type = WORKER_TYPE
        this.command = new Command(opts.command)
        this.execAsync = this.Promise.promisify(exec)
    }

    run (opts = {}) {
        let {Promise} = this
        let schema = {
            required: [ 'params' ],
            properties: {
                params: { type: 'object', example: {}, description: '' }
            }
        }
        try { utils.validateWith(schema, opts) } catch (err) {
            return Promise.reject(err)
        }

        // '{}' にて記述されている名前のものをすべて required とする
        let paramsSchema = {
            required:   this.command.parsed.names,
            properties: {}
        }

        let {params} = opts

        let paramsV
        try { paramsV = utils.validateWith(paramsSchema, params) } catch (err) {
            return Promise.reject(err)
        }

        return Promise.resolve()
            .then(() => {
                let cmd = this.command.withParams(params)
                let cmdOpts = {}

                return this.execAsync(cmd, cmdOpts)
                    .then((stdout) => {
                        let result = {
                            code:   0,
                            stdout: stdout
                        }

                        return Promise.resolve(result)
                    })
                    .catch((err) => {
                        err.type = 'CommandExecFailure'
                        err.stderr = err.message
                        return Promise.reject(err)
                    })
            })
            .catch((err) => {
                return Promise.reject(err)
            })
    }
}

class Command {
    constructor (command = '') {
        this._ = command
        this.parsed = this.parse()
    }

    parse () {
        let command = this._
        let paramsRx = new RegExp('{[^}]+}', 'g')

        let params = command.match(paramsRx) || []

        let names = _.map(params, (p) => {
            // 両端の `{}` を除去する
            return p.replace(/{([^}]+)}/, '$1')
        })
        let commandFmt = command.replace(paramsRx, '%s')

        let parsed = {
            command_fmt: commandFmt,
            names:       names
        }

        return parsed
    }

    withParams (params = {}, opts = {}) {
        let {parsed} = this
        let {strict: isStrict} = opts

        if(isStrict) {
            let schema = {
                required:   parsed.names,
                properties: {}
            }
            utils.validateWith(schema, params)
        }

        let args = _.map(parsed.names, (name) => {
            let arg = params[name]
            if(typeof arg === 'undefined') {
                arg = ''
            }
            return arg
        })

        let cmd = vsprintf(parsed.command_fmt, args)
        return cmd
    }
}

module.exports = Exec
