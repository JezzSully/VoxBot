const { bot_token, prefix } = require('./config');

const { LOGGER } = require('./logger');

const Discord = require('discord.js');
const { pingPongHandler } = require('./handlers/ping-pong');


const VoxBot = new Discord.Client();

const main = async () => {
    VoxBot.on('ready', () => {
        LOGGER.info(`Logged in as ${VoxBot.user.tag}`);
    });

    VoxBot.on('message', (message) => {

        console.log(message.author);
        //ignore bot messsages 
        if(message.author.bot) {
            return;
        }

        //ignore non prefixed messages
        if (!message.content.startsWith(prefix)) {
            return;
        }
        
        pingPongHandler(message);
    });

    try {
        VoxBot.login(bot_token);
    } catch (e) {
        LOGGER.error(e);
    }
}

main();