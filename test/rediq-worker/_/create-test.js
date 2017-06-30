const should = require('should')
const Worker = require('rediq-worker')

describe('rediq-worker', () => {
    describe('.create', () => {
        it('call', (done) => {
            Worker.should.have.properties('create').which.is.a.Function()
            done()
        })

        describe('`type`', () => {
            it('`base` ->  `base` ワーカを得られる', (done) => {
                let w = Worker.create('base')
                w.type.should.be.equal('base')
                done()
            })

            it('未サポートエラーを得られる', (done) => {
                try {
                    let w = Worker.create('not_supported_type')
                    should.fail()
                } catch (err) {
                    err.type.should.be.equal('UnsupportedWorkerType')
                }
                done()
            })
        })
    })
})
