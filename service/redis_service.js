const Redis = require('ioredis');
const client = new Redis(require('../setting').redis);

module.exports = client;