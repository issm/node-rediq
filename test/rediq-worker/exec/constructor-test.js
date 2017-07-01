const should = require('should')
const Worker = require('rediq-worker/exec')

describe('rediq-worker/exec', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let opts = { command: 'ls {path}' }
            let worker = new Worker(opts)

            worker.should.have.property('type').which.is.equal('exec')

            // extended
            worker.should.have.property('Promise').which.is.Function()
            worker.should.have.property('Pr').which.is.Function()

            done()
        })
    })
})
