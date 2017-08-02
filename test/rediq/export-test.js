const should = require('should')

describe('rediq', () => {
    describe('export', () => {
        it('各種クラスを持っている', (done) => {
            let Rediq = require('rediq')

            Rediq.should.have.property('Client')
            Rediq.should.have.property('Watcher')
            Rediq.should.have.property('Worker')
            Rediq.should.have.property('utils')

            done()
        })
    })
})
