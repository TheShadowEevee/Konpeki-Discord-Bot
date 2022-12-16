/*
*  Konpeki Discord Bot - Slash Command Definition File
*  server-icon.js - A Discord server icon grabbing function
*/

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-icon')
		.setDescription('Shares this servers current icon')

	// Optional choice for user to choose icon size; 4096 if no selection.
		.addStringOption(option =>
			option.setName('format')
				.setDescription('Select what format you want the output to be')
				.addChoices(
					{ name: 'WebP', value: 'webp' },
					{ name: 'PNG', value: 'png' },
					{ name: 'JPEG', value: 'jpg' },
				))


	// Optional choice for user to choose icon format; webp if no selection.
		.addStringOption(option =>
			option.setName('size')
				.setDescription('Select what size you want the output to be')
				.addChoices(
					{ name: '4096px', value: '4096' },
					{ name: '2048px', value: '2048' },
					{ name: '1024px', value: '1024' },
					{ name: '600px', value: '600' },
					{ name: '512px', value: '512' },
					{ name: '300px', value: '300' },
					{ name: '256px', value: '256' },
					{ name: '128px', value: '128' },
					{ name: '96px', value: '96' },
					{ name: '64px', value: '64' },
					{ name: '56px', value: '56' },
					{ name: '32px', value: '32' },
					{ name: '16px', value: '16' },
				))


	// Optional Ephemeral check to allow user to choose command results to be shared publicly or private; send to self only if no selection.
		.addStringOption(option =>
			option.setName('ephemeral')
				.setDescription('Post the icon in the current channel')
				.addChoices(
					{ name: 'Send to me only', value: 'true' },
					{ name: 'Send in channel', value: 'false' },
				)),

	async execute(interaction) {
		const iconFormat = interaction.options.getString('format') ?? 'webp';
		const iconSize = Number(interaction.options.getString('size')) ?? 4096;
		const isEphemeral = interaction.options.getString('ephemeral') ?? 'true';

		await interaction.reply({ content: `${interaction.guild.iconURL({ extension:iconFormat, size:iconSize, forceStatic:false })}`, ephemeral: (isEphemeral === 'true') });
	},
};