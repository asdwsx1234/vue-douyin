const redis = require('ioredis')
const client = redis.createClient(6379, 'localhost')
module.exports = client
