const { prefix } = require('../config');
const { LOGGER } = require('../logger');

const raidListStore = [];

const raidCreate = (message, args) => {
    if(args.length < 2) {
        message.channel.send('Invalid Request: please provide another argument');
    } else {
        message.channel.send(`Creating group with name: ${args[1]}`);
        raidListStore.push({
            name: args[1],
            leader: message.author.name
        });
    }
};

const raidList = (message) => {
    message.channel.send('Check local logs');
    console.log(raidListStore);
};

const raidHandler = (message) => {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args[0];

    if(command === 'create') {
        raidCreate(message, args);
    }
    if(command === 'list') {
        raidList(message);
    }
};

module.exports = {
    raidHandler
};