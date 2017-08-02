'use strict'

const Promise = require('bluebird')
const Rediq = require('rediq')

const main = () => {
    let client = new Rediq.Client({
        target: 'rediq-sandbox'
    })

    return Promise.delay(100)
        .then(() => {
            console.log('worker: ls')
            return client.enqueue({
                id: 'ls',
                params: { path: '/' }
            })
        })
        .delay(100)
        .then(() => {
            console.log('worker: lsl')
            return client.enqueue({
                id: 'lsl',
                params: { path: '/' }
            })
        })
        .delay(500)
        .then(() => {
            console.log('worker: ls')
            return client.enqueue({
                id: 'ls',
                params: { path: '/' }
            })
        })
        .delay(100)
        .then(() => {
            console.log('worker: unregistered, ls, lsl')
            return Promise.join(
                client.enqueue({
                    id: 'unregistered',
                    params: {}
                }),
                client.enqueue({
                    id: 'ls',
                    params: { path: '/' }
                }),
                client.enqueue({
                    id: 'lsl',
                    params: { path: '/' }
                }),
                () => {
                    return Promise.delay(100)
                })
        })
        .then(() => {
            console.log('worker: foobar')
            return client.enqueue({
                id: 'foobar',
                params: { foo: 1, bar: 2 }
            })
        })
        .delay(100)
        .then(() => {
            console.log('terminate watcher')
            return client.enqueue({
                id: '__admin',
                params: { command: 'exit' }
            })
        })
        .then(() => {
            process.exit(0)
        })
}

main()
