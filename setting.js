module.exports = {
  service: {
    port: 2333
  },
  logger: {
    path: `${__dirname}/logs/`
  },
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  mongodb: {
    port: 27017,
    host: 'localhost',
    database: 'bilibili'
  },
  spider: {
    domain: ''
  }
}