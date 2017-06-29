const Client = require('../rediq-client')
const Watcher = require('../rediq-watcher')

class Rediq {
}

Rediq.Client = Client
Rediq.Watcher = Watcher

module.exports = Rediq
