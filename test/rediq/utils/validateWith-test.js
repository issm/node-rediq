const should = require('should')
const utils = require('rediq/utils')

describe('rediq/utils', () => {
    describe('.validateWith', () => {
        it('呼び出せる', (done) => {
            utils.should.have.property('validateWith').which.is.a.Function()
            done()
        })

        const f = utils.validateWith

        let schema = {
            required: [ 'foo'  ],
            properties: {
                foo: { type: 'integer', example: 1 },
                bar: { type: 'string',  example: 'hoge' }
            }
        }

        describe('非Promise式', () => {
            it('valid -> 結果オブジェクトを得られる', (done) => {
                let data = { foo: 1234 }
                let opts = {}
                let result = f(schema, data, opts)

                should.exist(result)
                result.should.be.an.Object()
                result.should.have.property('valid').which.is.equal(true)
                result.should.have.property('errors').which.is.equal(null)
                result.should.have.property('_ajv').which.is.an.Object()

                done()
            })

            it('invalid -> 情報の入ったエラーを得られる', (done) => {
                let data = { foo: 'foobar' }
                let opts = {}

                try {
                    f(schema, data, opts)
                    should.fail()
                } catch (err) {
                    should.exist(err)
                    err.should.have.property('type').which.is.equal('ValidationFailure')
                    err.should.have.property('errors').which.is.an.Array()
                }
                done()
            })

        })

        describe('Promise式', () => {
            it('then で結果情報が渡ってくる', (done) => {
                let data = { foo: 1234 }
                let opts = { promise: true }
                let pr = f(schema, data, opts)

                pr.constructor.name.should.be.equal('Promise')
                pr.should.have.property('then').which.is.a.Function()
                pr.should.have.property('catch').which.is.a.Function()

                pr
                    .then((result) => {
                        should.exist(result)
                        result.should.be.an.Object()
                        result.should.have.property('valid').which.is.equal(true)
                        result.should.have.property('errors').which.is.equal(null)
                        result.should.have.property('_ajv').which.is.an.Object()

                        done()
                    })
                    .catch((err) => {
                        should.fail()
                        done()
                    })
            })

            it('catch で情報の入ったエラーを得られる', (done) => {
                let data = { foo: 'foobar' }
                let opts = { promise: true }
                let pr = f(schema, data, opts)

                pr.constructor.name.should.be.equal('Promise')
                pr.should.have.property('then').which.is.a.Function()
                pr.should.have.property('catch').which.is.a.Function()

                pr
                    .then((result) => {
                        should.fail()
                        done()
                    })
                    .catch((err) => {
                        should.exist(err)
                        err.should.have.property('type').which.is.equal('ValidationFailure')
                        err.should.have.property('errors').which.is.an.Array()

                        done()
                    })
            })
        })
    })
})
