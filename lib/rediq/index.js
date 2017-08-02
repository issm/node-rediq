const Client = require('../rediq-client')
const Watcher = require('../rediq-watcher')
const Worker = require('../rediq-worker')
const utils = require('../rediq/utils')

class Rediq {
}

Rediq.Client = Client
Rediq.Watcher = Watcher
Rediq.Worker = Worker
Rediq.utils = utils

module.exports = Rediq
