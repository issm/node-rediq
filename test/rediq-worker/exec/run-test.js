const should = require('should')
const Worker = require('rediq-worker/exec')

describe('rediq-worker/exec', () => {
    describe('#run', () => {
        let workerOpts = { command: 'ls {path1} {path2}' }
        let worker = new Worker(workerOpts)

        it('Promise オブジェクトである', (done) => {
            let runOpts = {
                params: { path1: '/', path2: '/tmp/' }
            }
            let run = worker.run(runOpts)
                //.then(() => {}
                // .catch(() => {
                //     should.fail()
                // })

            run.should.have.property('then').which.is.a.Function()
            run.should.have.property('catch').which.is.a.Function()

            done()
        })

        it('コマンド成功時，標準出力を含む情報得られる', (done) => {
            let runOpts = {
                params: { path1: '/', path2: '/tmp/' }
            }
            let run = worker.run(runOpts)
                .then((result) => {
                    should.exist(result)
                    result.should.have.property('code').which.is.a.Number()
                    result.should.have.property('stdout').which.is.a.String()

                    done()
                })
                .catch((err) => {
                    should.fail()
                    done()
                })
        })

        it('コマンド失敗時，各種情報の入ったエラーを得られる', (done) => {
            let runOpts = {
                params: { path1: '/', path2: './foobar/' }
            }
            let run = worker.run(runOpts)
                .then((result) => {
                    should.fail()
                    done()
                })
                .catch((err) => {
                    should.exist(err)
                    err.type.should.be.equal('CommandExecFailure')
                    err.should.have.property('code').which.is.a.Number()
                    err.should.have.property('stderr').which.is.a.String()

                    done()
                })
        })
    })
})
