const should = require('should')
const {Watcher} = require('rediq')

describe('rediq-watcher', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let client = new Watcher()

            client.should.have.properties('redis').which.is.a.Object()

            done()
        })

        describe('connection to Redis', () => {
            let watcher = new Watcher()

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
