class Worker {
    static create (type = 'base', opts = {}) {
        let worker

        try {
            let W = require(`./${type}`)
            worker = new W(opts)
        } catch (err) {
            err.type = 'UnsupportedWorkerType'
            throw err
        }

        return worker
    }
}

module.exports = Worker
