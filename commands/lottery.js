/*
*  Konpeki Discord Bot - Slash Command Definition File
*  lottery.js - Rolls X numbers from 1 - Y and returns them
*/

const { SlashCommandBuilder } = require('discord.js');
const { randomInt } = require('node:crypto');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lottery')
		.setDescription('Rolls a set of numbers you can use for whatever')

		// Get number of numbers to roll
		.addNumberOption(option =>
			option.setName('count')
				.setDescription('How many numbers to roll'),
		)

		// Get max number to roll
		.addNumberOption(option =>
			option.setName('max')
				.setDescription('Set the maximum roll'),
		)

		// Optional Ephemeral check to allow user to choose command results to be shared publicly or private; send to self only if no selection.
		.addStringOption(option =>
			option.setName('ephemeral')
				.setDescription('Post the avatar in the current channel')
				.addChoices(
					{ name: 'Send to me only', value: 'true' },
					{ name: 'Send in channel', value: 'false' },
				)),

	async execute(interaction) {
		const isEphemeral = interaction.options.getString('ephemeral') ?? 'true';
		const rollCount = interaction.options.getNumber('count') ?? 6;
		const maxRoll = interaction.options.getNumber('max') ?? 99;

		// Limit max number rollable to prevent spam and API issues
		if (maxRoll > 999) {
			await interaction.reply({ content: `Big roller! Unfortunatly ${maxRoll} is too big a number for me. Try somewhere below 1000!`, ephemeral: true });
			return;
		}
		// Prevent 0 or less numbers
		else if (maxRoll < 1) {
			await interaction.reply({ content: `The fewer numbers, the higher the odds! Unfortunatly ${maxRoll} is too low a number... Try a positive number under 1000!`, ephemeral:true });
			return;
		}

		// Limit numbers rollable to prevent spam and API issues
		if (rollCount > 9) {
			await interaction.reply({ content: `You want ${rollCount} numbers?! That's a bit much, even for me...\nTry 9 or less please!`, ephemeral: true });
			return;
		}
		// Prevent 0 or less numbers
		else if (rollCount < 1) {
			await interaction.reply({ content: `It's kinda difficult to roll ${rollCount} numbers...\nTry a positive single digit number!`, ephemeral:true });
			return;
		}

		const lotteryNumbers = [];

		for (let i = 0; i < rollCount; i++) {
			lotteryNumbers.push(randomInt(1, maxRoll));
		}

		await interaction.reply({ content: `Your lucky numbers are...\n${lotteryNumbers.toString().split(',').join(', ')}.`, ephemeral: (isEphemeral === 'true') });
	},
};