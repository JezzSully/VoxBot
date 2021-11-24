const winston = require('winston');

const LOGGER = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/full.log' }),
  ],
});

module.exports = {
  LOGGER,
};
