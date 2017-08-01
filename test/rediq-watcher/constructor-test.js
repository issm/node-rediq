const should = require('should')
const {Watcher} = require('rediq')

describe('rediq-watcher', () => {
    describe('constructor options', () => {
        describe('`target`', () => {
            it('missing -> error', (done) => {
                try {
                    let opts = {}
                    let watcher = new Watcher(opts)
                    should.fail()
                } catch(err) {
                    should.exist(err)
                } finally {
                    done()
                }
            })

            it('specified -> ok', (done) => {
                try {
                    let opts = {}
                    let watcher = new Watcher(opts)
                    should.exist(watcher)
                } catch(err) {
                    should.fail()
                } finally {
                    done()
                }
            })
        })
    })

    describe('constructor', () => {
        it('properties', (done) => {
            let opts = { target: 'foobar' }
            let watcher = new Watcher(opts)

            watcher.should.have.property('redis').which.is.a.Object()
            watcher.should.have.property('target').which.is.equal(opts.target)

            done()
        })

        describe('connection to Redis', () => {
            let opts = { target: 'foobar' }
            let watcher = new Watcher(opts)

            let key = 'rediq-watcher:foobar'
            let val = 'foo-bar-baz'

            it('セットできる', (done) => {
                watcher.redis.setAsync(key, val, 'EX', 20)
                    .then((res) => {
                        should.exists(res)
                        done()
                    })
                    .catch((err) => {
                        should.fail()
                        done()
                    })
            })

            it('セットした情報を取得できる', (done) => {
                watcher.redis.getAsync(key)
                    .then((res) => {
                        res.should.be.equal(val)
                        done()
                    })
                    .catch((err) => {
                        done()
                    })
            })
        })
    })
})
