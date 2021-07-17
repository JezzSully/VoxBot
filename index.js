const { bot_token, prefix, channelList } = require('./config');

const { LOGGER } = require('./logger');

const Discord = require('discord.js');
const { pingPongHandler } = require('./handlers/ping-pong');
const { raidHandler } = require('./handlers/raid');


const VoxBot = new Discord.Client();

const main = async () => {
    VoxBot.on('ready', () => {
        LOGGER.info(`Logged in as ${VoxBot.user.tag}`);
    });

    VoxBot.on('unhandledRejection', (error) => {
        LOGGER.error(error);
    });

    VoxBot.on('message', (message) => {

        //ignore bot messsages 
        if(message.author.bot) {
            return;
        }

        //ignore non prefixed messages
        if (!message.content.startsWith(prefix)) {
            return;
        }

        switch(message.channel.id) {
            case channelList.devChannel:
                //
                //break;
            default:
                break;
        }

        
        //Sort by channels(?)
        pingPongHandler(message);

        raidHandler(message);
    });

    try {
        VoxBot.login(bot_token);
    } catch (e) {
        LOGGER.error(e);
    }
}

main();