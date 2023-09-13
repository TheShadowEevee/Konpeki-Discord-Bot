/*
*  Konpeki Discord Bot - Slash Command Definition File
*  invite.js - Uses your bot's clientID to create and share it's own invite link
*/

const { SlashCommandBuilder } = require('discord.js');

// Get the clientID and bot name from the config file
const { botName, clientId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(`Invite ${botName} to your own server`),
    async execute(interaction) {
        await interaction.reply({ content: `Use this link to invite ${botName} (That's me!) to your own server!\nhttps://discord.com/oauth2/authorize?client_id=${clientId}&permissions=274877908992&scope=bot%20applications.commands`, ephemeral: true });
    },
};