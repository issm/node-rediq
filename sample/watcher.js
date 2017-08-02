'use strict'

const Promise = require('bluebird')
const Rediq = require('rediq')

const main = () => {
    let watcher = new Rediq.Watcher({
        target: 'rediq-sandbox'
    })

    let lslWorker = Rediq.Worker.create(
        'exec',
        { command: 'ls -l {path}' }
    )

    let foobarWorker = {
        type: 'foobar',
        run: (params = {}) => {
            return Promise.resolve({})
        }
    }

    return Promise.join(
        // preset
        watcher.register({
            type: 'exec',
            id:   'ls',
            opts: {
                command: 'ls {path}'
            }
        }),
        // manually created with preset
        watcher.register({
            worker: lslWorker,
            id:     'lsl'
        }),
        // full-manually created
        watcher.register({
            worker: foobarWorker,
            id:     'foobar'
        }),
        //
        (w1, w2, w3) => {
            watcher.watch()
                .then((code) => {
                    process.exit(code)
                })
                .catch((err) => {
                    process.exit(err.code || 1)
                })
        })
        .catch((err) => {
            console.log(err)
            process.exit(1)
        }
    )
}

main()
