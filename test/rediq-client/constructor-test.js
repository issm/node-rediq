const should = require('should')
const {Client} = require('rediq')

describe('rediq-client', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let client = new Client()

            client.should.have.properties('redis').which.is.a.Object()

            done()
        })

        describe('connection to Redis', () => {
            let client = new Client()

            let key = 'rediq-client:foobar'
            let val = 'foo-bar-baz'

            it('セットできる', (done) => {
                client.redis.setAsync(key, val, 'EX', 20)
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
                client.redis.getAsync(key)
                    .then((res) => {
                        res.should.be.equal(val)
                        done()
                    })
                    .catch((err) => {
                        should.fail()
                        done()
                    })
            })
        })
    })
})
