/*
*  Konpeki Discord Bot - Slash Command Configuration File
*  deploy-commands.js - Gathers all current .js files in the commands folder and publishes a list to Discord
*
*  Code modified based on example from the discord.js guides
*/

const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandsHelp = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	commandsHelp.push(command.data);
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// Generate help-text.json
try {
	console.log(`Generating ${commands.length} help text entries.`);

	let helpJSONString = '{\n';

	for (let i = 0; i < commandsHelp.length; i++) {
		helpJSONString += `	"${commandsHelp[i].name}": {\n`;
		helpJSONString += `    	"description": "${commandsHelp[i].description}",\n`;
		helpJSONString += '    	"options": {\n';

		for (let j = 0; j < commandsHelp[i].options.length; j++) {

			helpJSONString += `		"${commandsHelp[i].options[j].name}": {\n`;
			helpJSONString += `			"description": "${commandsHelp[i].options[j].description}",\n`;
			helpJSONString += `			"required": "${commandsHelp[i].options[j].required}",\n`;
			helpJSONString += '    		"choices": {\n';

			if (typeof commandsHelp[i].options[j].choices !== 'undefined') {
				for (let k = 0; k < commandsHelp[i].options[j].choices.length; k++) {

					helpJSONString += `				"${commandsHelp[i].options[j].choices[k].name}": {\n`;
					helpJSONString += `					"value": "${commandsHelp[i].options[j].choices[k].value}",\n`;
					helpJSONString += '    	},\n';

				}
			}

			helpJSONString += '    	},\n';
			helpJSONString += '    	},\n';

		}

		helpJSONString += '	},\n';
		helpJSONString += '	},\n';
	}

	helpJSONString += '}';

	// Lazy way out of removing trailing commas
	// See https://stackoverflow.com/a/34347475
	const helpJSON = JSON.stringify(JSON.parse(helpJSONString.replace(/,(?!\s*?[{["'\w])/g, '')), null, 4);

	// write file to disk
	fs.writeFile('./data/help-text.json', helpJSON, err => {
		if (err) {
			console.log(`Unable to write help-text.json: ${err}`);
			console.log('Stopping...');
			return;
		}
	});

	console.log(`Successfully generated ${commandsHelp.length} help text entries.`);

	console.log();

	// Update slash commands on Discord's side
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			// The put method is used to fully refresh all commands
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		}
		catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
}
catch (error) {
	// And of course, make sure you catch and log any errors!
	console.error(error);
}