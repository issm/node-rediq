const should = require('should')
const {Client} = require('rediq')

describe('rediq-client', () => {
    describe('constructor', () => {
        it('properties', (done) => {
            let client = new Client()

            client.should.have.properties('redis').which.is.a.Object()

            done()
        })
    })
})
