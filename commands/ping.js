/*
*  Konpeki Shiho - Slash Command Definition File
*  ping.js - A simple ping function
*
*  Function modified from https://discordjs.guide/creating-your-bot/slash-commands.html
*/

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Checks to see if the you or the bot is online'),
	async execute(interaction) {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	},
};