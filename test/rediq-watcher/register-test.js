const should = require('should')
const {Watcher, Worker} = require('rediq')

describe('rediq-watcher', () => {
    describe('#register', () => {

        describe('`type` specifying', () => {
            let opts = { target: 'foobar' }
            let watcher = new Watcher(opts)

            it('preset', (done) => {
                try {
                    watcher.register({
                        type: 'base'
                    })
                        .then((id) => {
                            should.exist(id)
                            id.should.be.equal('base')
                            done()
                        })
                        .catch((err) => {
                            should.fail()
                            done()
                        })
                } catch(err) {
                    should.fail()
                    done()
                }
            })
        })

        describe('`worker` specifying', () => {

            it('with preset', (done) => {
                let opts = { target: 'foobar' }
                let watcher = new Watcher(opts)

                let worker = Worker.create('base')

                try {
                    watcher.register({
                        worker: worker
                    })
                        .then((id) => {
                            should.exist(id)
                            id.should.be.equal('base')
                            done()
                        })
                        .catch((err) => {
                            should.fail()
                            done()
                        })
                } catch(err) {
                    should.fail()
                    done()
                }
            })

            describe('full manual: `type`, `run` are required', () => {
                let opts = { target: 'foobar' }
                let watcher = new Watcher(opts)

                it('satisfied', (done) => {
                    let worker = {
                        type: 'foobar',
                        run:  () => {}
                    }

                    try {
                        watcher.register({
                            worker: worker
                        })
                            .then((id) => {
                                should.exist(id)
                                id.should.be.equal('foobar')
                                done()
                            })
                            .catch((err) => {
                                should.fail()
                                done()
                            })
                    } catch(err) {
                        should.fail()
                        done()
                    }
                })

                it('`type` is missing', (done) => {
                    let worker = {
                        run:  () => {}
                    }

                    try {
                        watcher.register({
                            worker: worker
                        })
                            .then((id) => {
                                should.fail()
                                done()
                            })
                            .catch((err) => {
                                should.fail()
                                done()
                            })
                    } catch(err) {
                        should.exist(err)
                        done()
                    }
                })

                it('`run` is missing', (done) => {
                    let worker = {
                        type: 'foobar'
                    }

                    try {
                        watcher.register({
                            worker: worker
                        })
                            .then((id) => {
                                should.fail()
                                done()
                            })
                            .catch((err) => {
                                should.fail()
                                done()
                            })
                    } catch(err) {
                        should.exist(err)
                        done()
                    }
                })
            })
        })

        describe('optionals', () => {
            describe('`id`', () => {
                let opts = { target: 'foobar' }
                let watcher = new Watcher(opts)

                it('registered as `id`', (done) => {
                    watcher.register({
                        type: 'base',
                        id:   'foobar'
                    })
                        .then((id) => {
                            should.exist(id)
                            id.should.be.equal('foobar')
                            done()
                        })
                })

                it('cannot register duplicated id', (done) => {
                    watcher.register({
                        type: 'base',
                        id:   'foobar'
                    })
                        .then((id) => {
                            should.fail()
                            done()
                        })
                        .catch((err) => {
                            should.exist(err)
                            done()
                        })
                })
            })
        })
    })
})
