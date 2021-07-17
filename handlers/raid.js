const Discord = require('discord.js');
const { prefix, channelList } = require('../config');
const { LOGGER } = require('../logger');

const raidListStore = [];

const getIndexForAuthor = async (message) => {
    let group;
    raidListStore.forEach((entry) => {
        if (entry.leader == message.author.id) {
            group = entry;
        }
    });
    return group;
};

const raidCreate = async (message, args) => {
    if (args.length < 2) {
        message.channel.send('Invalid Request: please provide another argument');
        return;
    }

    //if already owns a group
    const group = await getIndexForAuthor(message);
    if (group) {
        message.channel.send('You already own a group. Please disband your old group first');
        return;
    }

    message.channel.send(`Creating group with name: ${args[1]}`);

    //Create text channel
    let textChannel;
    await message.guild.channels.create(`PF: ${args[1]}`, { reason: 'PF' }).then((channel) => {
        channel.setParent(channelList.partyFinderCategory);
        textChannel = channel;
    });

    //Create voice channel
    let voiceChannel;
    await message.guild.channels.create(`PF: ${args[1]}`, { type: 'voice', reason: 'PF' }).then((channel) => {
        channel.setParent(channelList.partyFinderCategory);
        voiceChannel = channel;
    });

    if (!textChannel || !voiceChannel) {
        message.channel.send('Error Creating Channels');
        LOGGER.error('Error creating channels');
        if (textChannel) textChannel.delete();
        if (voiceChannel) voiceChannel.delete();
        return;
    }

    //Do fancy message
    let thisMessage;
    const embedMessage = new Discord.MessageEmbed()
        .setTitle(`PartyFinder: ${args[1]}`)
        .setDescription('')
        .addFields(
            { name: 'Tanks', value: 'Empty'},
            { name: 'Healers', value: 'Empty'},
            { name: 'DPS', value: 'empty'}
        )
        .setFooter('I made dis');

    await message.channel.send(embedMessage).then((x) => {
        //x.react(); //tankLogo
        //x.react(); //healLogo
        //x.react(); //DPSLogo
        console.log(x);
        thisMessage = x;
    });

    raidListStore.push({
        name: args[1],
        leader: message.author.id,
        textChannel,
        voiceChannel,
        message: thisMessage,
        members: []
    });

    //Do an @ message
    textChannel.send(`${message.author}`);
    message.channel.send('Group Created').then((x) => {
        // x.react(`\:smile:`);
    });
    message.react('👍'); //having emojiis in code is cursed
};

const raidDisband = async (message) => {
    LOGGER.info('Raid Delete Request');
    const group = await getIndexForAuthor(message);
    if (group) {
        group.textChannel.delete();
        group.voiceChannel.delete();
        group.message.delete();
        const index = raidListStore.indexOf(group);
        raidListStore.splice(index, 1);
        message.channel.send('Raid Group disbanded');
        message.delete();
    } else {
        LOGGER.info({ message: 'No raids owned by author', author: message.author.id });
        message.channel.send('No raids owned by this author.');
    }
}

const raidList = (message) => {
    message.channel.send('Check local logs');
    console.log(raidListStore);
    message.delete();
};

const raidMessageHandler = (message) => {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args[0];

    if (command === 'create') {
        raidCreate(message, args);
    }
    if (command === 'list') {
        raidList(message);
    }
    if (command === 'disband') {
        raidDisband(message)
    }
};

const raidReactionHandler = (reaction, user) => {
    //may not need this?
    if(!reaction.message.author.bot) {
        return;
    }

    //if message is one of raid messages
    let group;
    raidListStore.forEach((entry) => {
        if(entry.message.id === reaction.message.id) {
            group = entry;
        }
    });

    if(!group) {
        return;
    }

    group.members.push(user);

    //edit message;
    const oldEmbed = reaction.message.embeds[0];
    const newEmbed = new Discord.MessageEmbed(oldEmbed).setFooter('new footer');

    reaction.message.edit(newEmbed);
}

module.exports = {
    raidMessageHandler,
    raidReactionHandler
};