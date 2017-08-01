const Client = require('../rediq-client')
const Watcher = require('../rediq-watcher')
const Worker = require('../rediq-worker')

class Rediq {
}

Rediq.Client = Client
Rediq.Watcher = Watcher
Rediq.Worker = Worker

module.exports = Rediq
