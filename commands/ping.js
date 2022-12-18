/*
*  Konpeki Discord Bot - Slash Command Definition File
*  ping.js - A simple ping function
*
*  Function modified from https://discordjs.guide/creating-your-bot/slash-commands.html
*/

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Checks to see if the bot is online, as well as it\'s ping'),
	async execute(interaction) {
		await interaction.reply({ content: `Pong! Current Websocket Heartbeat / ping is ${interaction.client.ws.ping}ms.`, ephemeral: true });
	},
};