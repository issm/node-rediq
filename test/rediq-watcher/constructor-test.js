const should = require('should')
const {Watcher} = require('rediq')

describe('rediq-watcher', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let client = new Watcher()

            client.should.have.properties('redis').which.is.a.Object()

            done()
        })
    })
})
