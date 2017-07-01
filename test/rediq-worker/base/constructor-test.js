const should = require('should')
const Worker = require('rediq-worker/base')

describe('rediq-worker/base', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let worker = new Worker()

            worker.should.have.property('type').which.is.equal('base')
            worker.should.have.property('Promise').which.is.Function()
            worker.should.have.property('Pr').which.is.Function()

            done()
        })
    })
})
