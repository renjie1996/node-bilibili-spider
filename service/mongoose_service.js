const mongoose = require('mongoose');
const logger = require('../utils/loggers/app_logger');
const { mongodb } = require('../setting');

mongoose.Promise = Promise;

const uri = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`;

const connection = mongoose.connect(uri);

const db = mongoose.connection;

db.on('open', () => {
  logger.info(`successfully connecting to db, uri: ${uri}`);
});

db.on('error', (e) => {
  logger.error(`error connection to db, uri: ${uri}`, { err: e});
});

module.exports = db;