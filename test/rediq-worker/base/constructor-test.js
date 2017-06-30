const should = require('should')
const Worker = require('rediq-worker/base')

describe('rediq-worker', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let worker = new Worker()

            worker.should.have.property('type').which.is.equal('base')

            done()
        })
    })
})
