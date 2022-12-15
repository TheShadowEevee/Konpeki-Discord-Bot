const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log('Started deleting all application (/) commands.');

		// The put method is used to fully refresh all commands
		rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application (/) commands.'))
			.catch(console.error);

	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();