const { bot_token, prefix, channelList } = require('./config');

const { LOGGER } = require('./logger');

const Discord = require('discord.js');
const { pingPongHandler } = require('./handlers/ping-pong');
const { raidMessageHandler, raidReactionHandler } = require('./handlers/raid');


const VoxBot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

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
                //Put specific handlers here
                break;
            default:
                break;
        }

        
        //Sort by channels(?)
        pingPongHandler(message);

        raidMessageHandler(message);
    });

    VoxBot.on('messageReactionRemove', async (reaction, user) => {
        if(reaction.partial) {
            try {
                await reaction.fetch();
            }catch (err) {
                LOGGER.error('Fetching failed.');
                return;
            }
        }

        switch(reaction.message.channel.id) {
            case channelList.devChannel:
                raidReactionHandler(reaction,user, false);
                break;
            default:
                break;
        }
    });

    VoxBot.on('messageReactionAdd', async (reaction, user) => {
        if(reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                LOGGER.error('Fetching failed.');
                return;
            }
        }
        switch(reaction.message.channel.id) {
            case channelList.devChannel:
                raidReactionHandler(reaction,user, true);
                break;
            default:
                break;
        }
    });

    try {
        VoxBot.login(bot_token);
    } catch (e) {
        LOGGER.error(e);
    }
}

main();