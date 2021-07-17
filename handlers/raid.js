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
        console.log(textChannel);
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

    raidListStore.push({
        name: args[1],
        leader: message.author.id,
        textChannel,
        voiceChannel
    });

    //Do an @ message
};

const raidDisband = async (message) => {
    console.log(message.author.id)
    const group = await getIndexForAuthor(message);
    console.log('group >>' + group);
    if (group) {
        LOGGER.info('Raid Delete Request');
        group.textChannel.delete();
        group.voiceChannel.delete();
        const index = raidListStore.indexOf(group);
        raidListStore.splice(index, 1);
        message.channel.send('Raid Group disbanded');
        message.delete();
    } else {
        console.log('No raids owned by author');
        message.channel.send('No raids owned by this author.');
    }
}

const raidList = (message) => {
    message.channel.send('Check local logs');
    console.log(raidListStore);
    message.delete();
};

const raidHandler = (message) => {
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

module.exports = {
    raidHandler
};