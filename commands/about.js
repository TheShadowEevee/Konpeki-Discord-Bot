/*
*  Konpeki Discord Bot - Slash Command Definition File
*  about.js - Shares information about the bot
*/

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Get the clientID and bot name from the config file
const { clientId, botName, botOwner } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Gives basic information about the bot'),
    async execute(interaction) {

        const exampleEmbed = new EmbedBuilder()
            .setColor(interaction.member.displayHexColor)
            .setTitle(`About ${botName}`)
            .setURL(`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=274877908992&scope=bot%20applications.commands`)
            .addFields(
                { name: 'Admin of this bot', value: `${botOwner}` },
                { name: 'Websocket Heartbeat / Ping', value: `${interaction.client.ws.ping}ms` },
                { name: 'Invite Link', value: `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=274877908992&scope=bot%20applications.commands`, inline: true },
                { name: 'Based on the open source Konpeki Discord Bot', value: 'https://github.com/TheShadowEevee/Konpeki-Discord-Bot', inline: true },
            )
            .setFooter({ text: `Support for custom changes should go through the admin of this bot, ${botOwner}. Support for the underlying Konpeki Discord Bot is available at https://discord.gg/Zt8zruXexJ.` });


        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    },
};