/*
*  Konpeki Discord Bot - Slash Command Definition File
*  help.js - Uses generated help text file to provide a help command
*/

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

const fs = require('fs');

let helpFile = '';

// Import help text file
if (fs.existsSync('./data/help-text.json')) {
	helpFile = JSON.parse(fs.readFileSync('./data/help-text.json', 'utf8'));
}

// List of all commands, by category
// Command help, listing options.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides information on avalible commands')

		// Allow choosing the help page to open
		.addNumberOption(option =>
			option.setName('page')
				.setDescription('Choose help page to skip to'),
		),

	async execute(interaction) {

		let pageNumber = interaction.options.getNumber('page') ?? 1;
		const commandsPerPage = 5;
		let commandsThisPage = 0;

		const numberOfCommands = Object.keys(helpFile).length;
		const pageTotal = String(Math.ceil(numberOfCommands / commandsPerPage));
		let userRoleColor = Number('0x' + interaction.member.displayHexColor.split('#')[1]);

		// This will also unintentionally catch roles with full black color (#000000), but it should be fine.
		if (userRoleColor == 0) {
			userRoleColor = Number(0x55ffff);
		}

		if (pageNumber > pageTotal) {
			pageNumber = 1;
		}

		let embedPartOne = {
			color: userRoleColor,
			title: 'Help Text',
			description: `Page ${pageNumber} of ${pageTotal}`,
		};

		if (pageNumber != pageTotal) {
			commandsThisPage = commandsPerPage;
		}
		else {
			commandsThisPage = numberOfCommands % commandsPerPage;
		}

		let embedPartTwo = '';

		embedPartTwo += '{"fields": [';
		for (let i = 0; i < commandsThisPage; i++) {

			const currentCommandName = Object.keys(helpFile)[i + (commandsPerPage * (pageNumber - 1))];

			embedPartTwo += '{';

			embedPartTwo += '	"name": "/' + currentCommandName + '",',
			embedPartTwo += '	"value": "' + helpFile[currentCommandName].description + '"',

			embedPartTwo += '},';
		}
		embedPartTwo = embedPartTwo.substring(0, embedPartTwo.length - 1) + ']}';

		let buttonList = '';

		// Change buttons based on page number. Is there an easier/shorter way to do this?
		if (pageNumber == 1) {
			buttonList = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('back')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('page')
						.setLabel(`${pageNumber}/${pageTotal}`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Primary),
				);
		}
		else if (pageNumber == pageTotal) {
			buttonList = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('back')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('page')
						.setLabel(`${pageNumber}/${pageTotal}`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
				);
		}
		else {
			buttonList = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('back')
						.setLabel('Previous')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('page')
						.setLabel(`${pageNumber}/${pageTotal}`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle(ButtonStyle.Primary),
				);
		}

		// Button code
		const collector = interaction.channel.createMessageComponentCollector({ time: 300000 });

		collector.on('collect', async i => {

			if (i.customId === 'next') {
				pageNumber += 1;
			}
			if (i.customId === 'back') {
				pageNumber -= 1;
			}

			// Replicate the above code to remake the help model for the new page. Again, there has to be an easier way to do this.
			embedPartOne = {
				color: userRoleColor,
				title: 'Help Text',
				description: `Page ${pageNumber} of ${pageTotal}`,
			};

			embedPartTwo = '';

			if (pageNumber != pageTotal) {
				commandsThisPage = commandsPerPage;
			}
			else {
				commandsThisPage = numberOfCommands % commandsPerPage;
			}

			embedPartTwo += '{"fields": [';
			for (let j = 0; j < commandsThisPage; j++) {

				const currentCommandName = Object.keys(helpFile)[j + (commandsPerPage * (pageNumber - 1))];

				embedPartTwo += '{';

				embedPartTwo += '	"name": "/' + currentCommandName + '",',
				embedPartTwo += '	"value": "' + helpFile[currentCommandName].description + '"',

				embedPartTwo += '},';
			}
			embedPartTwo = embedPartTwo.substring(0, embedPartTwo.length - 1) + ']}';

			// Change buttons based on page number. Is there an easier/shorter way to do this?
			if (pageNumber == 1) {
				buttonList = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('back')
							.setLabel('Previous')
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('page')
							.setLabel(`${pageNumber}/${pageTotal}`)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('next')
							.setLabel('Next')
							.setStyle(ButtonStyle.Primary),
					);
			}
			else if (pageNumber == pageTotal) {
				buttonList = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('back')
							.setLabel('Previous')
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('page')
							.setLabel(`${pageNumber}/${pageTotal}`)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('next')
							.setLabel('Next')
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
					);
			}
			else {
				buttonList = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('back')
							.setLabel('Previous')
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('page')
							.setLabel(`${pageNumber}/${pageTotal}`)
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(true),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('next')
							.setLabel('Next')
							.setStyle(ButtonStyle.Primary),
					);
			}

			await i.update({ embeds: [Object.assign({}, embedPartOne, JSON.parse(embedPartTwo))], components: [ buttonList ], ephemeral: true });
		});

		await interaction.reply({ embeds: [Object.assign({}, embedPartOne, JSON.parse(embedPartTwo))], components: [ buttonList ], ephemeral: true });

	},
};