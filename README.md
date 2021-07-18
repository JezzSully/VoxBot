## VoxBot

# Config
As i dont commit my config (for obvious reasons, below is the contents for replication)

```JS
const bot_token = '<Bot Token Here>';
const prefix = '!';

const channelList = {
    devChannel: '<Channel Id for testing>',
    partyFinderCategory: '<Channel Id for partyfinder>'
};

const emojis = {
    dps: '<Emoji Id for DPS icon>',
    tank: '<Emoji Id for Tank icon>',
    healer: '<Emoji Id for Healer icon>'
};

module.exports = {
    bot_token,
    emojis,
    prefix,
    channelList
}
```