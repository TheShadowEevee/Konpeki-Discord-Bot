/*
*  Konpeki Discord Bot - Slash Command Definition File
*  rtd.js - In-Dev function
*/

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rtd')
		.setDescription('Currently being integrated. Outputs a XKCD valid random number.'),
	async execute(interaction) {
		const xkcdRandomNumber = 4;
		await interaction.reply({ content: `${interaction.client.user.tag} - Integration test of RTD command: XKCD random number is ${xkcdRandomNumber}.\nThis number is chosen by a fair dice roll and guaranteed to be random.\nSee <https://xkcd.com/221/>`, ephemeral: false });
	},
};