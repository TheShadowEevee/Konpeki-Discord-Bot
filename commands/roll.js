/*
*  Konpeki Discord Bot - Slash Command Definition File
*  lottery.js - Rolls X numbers from 1 - Y and returns them
*/

const { SlashCommandBuilder } = require('discord.js');
const { randomInt } = require('node:crypto');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a set of dice')

		// Get number of numbers to roll
		.addNumberOption(option =>
			option.setName('die')
				.setDescription('Type of dice to roll')
				.addChoices(
					{ name: 'd4', value: 4 },
					{ name: 'd6', value: 6 },
					{ name: 'd8', value: 8 },
					{ name: 'd10', value: 10 },
					{ name: 'd20', value: 20 },
					{ name: 'd100', value: 100 },
				))

		// Get max number to roll
		.addNumberOption(option =>
			option.setName('count')
				.setDescription('Amount of dice to roll'),
		)

		// Get max number to roll
		.addNumberOption(option =>
			option.setName('modifier')
				.setDescription('+/- to a dice roll'),
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
		const rollCount = interaction.options.getNumber('count') ?? 1;
		const dieType = interaction.options.getNumber('die') ?? 6;
		const rollMod = interaction.options.getNumber('modifier') ?? 0;

		let modSign = '';
		let rollModStr = '';
		let rollModNota = '';

		// Limit numbers rollable to prevent spam and API issues
		if (rollCount > 99) {
			await interaction.reply({ content: `You want ${rollCount} numbers?! That's a bit much, even for me...\nTry 99 or less please!`, ephemeral: true });
			return;
		}
		// Prevent 0 or less numbers
		else if (rollCount < 1) {
			await interaction.reply({ content: `It's kinda difficult to roll ${rollCount} numbers...\nTry a positive number!`, ephemeral:true });
			return;
		}

		const diceRolls = [];
		let rollSum = 0;

		for (let i = 0; i < rollCount; i++) {
			const randomNum = randomInt(1, dieType);

			diceRolls.push(randomNum);
			rollSum += randomNum;

		}

		if (rollMod < 0) {
			modSign = '-';
		}
		else if (rollMod > 0) {
			modSign = '+';
		}

		if (rollMod != 0) {
			rollModStr = ' ' + modSign + ' ' + rollMod;
			rollModNota = modSign + rollMod;
		}

		const diceRollsString = diceRolls.toString().split(',').join(' + ');

		for (let i = 0; i < rollCount; i++) {
			diceRolls.push(randomInt(1, dieType));
		}

		await interaction.reply({ content: `\`${rollCount}d${dieType}${rollModNota}\`\n\`Rolls: ( ${diceRollsString} )${rollModStr} = ${rollSum + rollMod}\``, ephemeral: (isEphemeral === 'true') });
	},
};