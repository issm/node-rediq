const should = require('should')
const Worker = require('rediq-worker/base')

describe('rediq-worker/base', () => {
    describe('#run', () => {
        it('Promise オブジェクトである', (done) => {
            let worker = new Worker()
            let run = worker.run().then(() => {}).catch(() => {})

            run.constructor.name.should.be.equal('Promise')
            run.should.have.property('then').which.is.a.Function()
            run.should.have.property('catch').which.is.a.Function()

            done()
        })
    })
})
