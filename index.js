/*
*  Konpeki Discord Bot - Main Bot File
*  All base level bot setup is done here
*/

// Require filesystem libraries
const fs = require('node:fs');
const path = require('node:path');

// Add pm2 metrics - this should NEVER track ANYTHING identifiable. This is purely for basic metrics and bot performance tracking
const metrics = require('./utils/pm2-metrics.js');

// Use a custom logging script
const logger = require('./utils/logging.js');

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, botOwner } = require('./config.json');
const { activity, status } = require('./presence.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Setup the commands collection
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		logger.log(logger.logLevels.WARN, `The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	logger.log(logger.logLevels.INFO, `${logger.colorText('Ready!', logger.textColor.Green)} Logged in as ${logger.colorText(c.user.tag, logger.textColor.Blue)}`);
	client.user.setPresence({ activities: [{ name: activity }], status: status });

	// Track websocket heartbeat with PM2 Histogram
	let latency = 0;
	setInterval(function() {
		latency = c.ws.ping;
		metrics.websocketHeartbeatHist.update(latency);
	}, 1000);

	// Report current server count with PM2 (Servers counted anonymously)
	metrics.serverCount.set(c.guilds.cache.size);

});

// Client "on" Events
// Someone used an interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.log(logger.logLevels.ERROR, `No command matching ${interaction.commandName} was found.`);
		await interaction.reply({ content: `This command no longer exists! Please contact ${botOwner} to report that this is happening!`, ephemeral: true });

		// Report error to PM2 dashboard
		metrics.interactionErrors.inc();
		metrics.io.notifyError(new Error('Interaction doesn\'t exist'), {
			custom: {
				interactionCommand: interaction.commandName,
			},
		});

		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		logger.log(logger.logLevels.ERROR, error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

		// Report error to PM2 dashboard
		metrics.interactionErrors.inc();
		metrics.io.notifyError(new Error('Error executing interaction'), {
			custom: {
				interactionCommand: interaction.commandName,
				error: error,
			},
		});

	}

	// Successful Execution, report as a PM2 metric
	// If the bot gets a lot of use, consider removing this for performance
	metrics.interactionSuccess();

});

// Joined a server
client.on(Events.GuildCreate, guild => {
	// Report current server count with PM2 (Servers counted anonymously)
	metrics.serverCount.set(guild.client.guilds.cache.size);
});

// Removed from a server
client.on(Events.GuildDelete, guild => {
	// Report current server count with PM2 (Servers counted anonymously)
	metrics.serverCount.set(guild.client.guilds.cache.size);
});

// Log in to Discord with your client's token
client.login(token);