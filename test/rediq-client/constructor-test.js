const should = require('should')
const {Client} = require('rediq')

describe('rediq-client', () => {
    describe('constructor options', () => {
        describe('`target`', () => {
            it('missing -> error', (done) => {
                try {
                    let opts = {}
                    let client = new Client(opts)
                    should.fail()
                } catch(err) {
                    should.exist(err)
                } finally {
                    done()
                }
            })

            it('specified -> ok', (done) => {
                try {
                    let opts = { target: 'booar' }
                    let client = new Client(opts)
                    should.exist(client)
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
            let client = new Client(opts)

            client.should.have.property('redis').which.is.a.Object()
            client.should.have.property('target').which.is.equal('foobar')

            done()
        })

        describe('connection to Redis', () => {
            let opts = { target: 'foobar' }
            let client = new Client(opts)

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
