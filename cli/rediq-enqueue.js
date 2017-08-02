#!/usr/bin/env node

'use strict'

const _ = require('lodash')
const camelcase = require('camelcase')
const Rediq = require('../lib/rediq')
const utils = Rediq.utils

const ENV_DEFAULTS = {
}

class Commander {
    constructor (argv) {
        const c = require('commander')
        const f = new CommandOptionValueFilter()

        c
            .version('0.0.1')
            .usage('[options]')
            .option('-h, --host <host>', '接続する Redis のホスト名．関連環境変数より優先される')
            .option('-p, --port <port>', '接続する Redis のポート番号．関連環境変数より優先される', f.int)
            .option('-n, --db <db>', '接続する Redis のデータベース番号．関連環境変数より優先される', f.int)
            .option('-t, --target <target>', '対象となるキューの名前')
            .option('-w, --id <id>', 'ワーカのID')
            .option('-d, --data <data>', 'ワーカへ渡すデータのJSON文字列', f.fromJson)
            .parse(argv)

        this._c = c
    }

    args () {
        return this._c.args
    }

    opts () {
        let opts = {}
        let c = this._c

        c.options.forEach((i) => {
            let k = i.long
            if(!k) { k = i.short }
            k = k.replace(/^-+/, '')

            if(k === 'version') { return }

            let kcc = camelcase(k)
            opts[kcc] = c[kcc]
        })

        return opts
    }

    showHelp (status = null) {
        this._c.outputHelp()
        if(status !== null) { process.exit(status) }
    }
}

class CommandOptionValueFilter {
    int (v) { return parseInt(v, 10) }
    fromJson (v) { return JSON.parse(v) }
}

class Runner {
    constructor (env, args, opts) {
        this.env = _.assign({}, ENV_DEFAULTS, env)
        this.args = args
        this.opts = opts
    }

    validate (c) {
        let opts = this.opts

        let optsSchema = {
            required: [ 'target', 'id', 'data' ],
            properties:   {
                'host':   { type: 'string', example: 'localhost' },
                'port':   { type: 'integer', example: 6379 },
                'db':     { type: 'integer', example: 1 },
                'target': { type: 'string', example: 'foobar' },
                'id':     { type: 'string', example: 'exec' },
                'data':   { type: 'object', example: {} },
            }
        }

        try {
            let optsV = utils.validateWith(optsSchema, opts)
        } catch(err) {
            _.forEach(err.errors, (e) => {
                console.error(`* ${e.message}`)
            })
            throw err
        }

        return true
    }

    run () {
        let {env, opts, args} = this
        let {host, port, db, target, id, data} = opts

        let redisOpts = { host: host, port: port, db: db }
        let client = new Rediq.Client({ target: target, redis: redisOpts })

        client.enqueue({ id: id, params: data })
            .then((result) => {
                console.log(result)
                process.exit(0)
            })
            .catch((err) => {
                console.error(err)
                process.exit(1)
            })
    }
}


const main = (env, argv) => {
    let c = new Commander(argv)
    let r = new Runner(env, c.args(), c.opts())
    r.validate(c)
    r.run()
}

main(process.env, process.argv)
