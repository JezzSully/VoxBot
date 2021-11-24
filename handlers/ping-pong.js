// const { LOGGER } = require('../logger');

const pingPongHandler = async (message) => {
  if (message.content === '!ping') {
    message.channel.send('Pong');
  }
};

module.exports = {
  pingPongHandler,
};
