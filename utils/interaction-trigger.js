const { Events } = require('discord.js');

const buttonInteraction = function(interaction) {
    const splitInteraction = interaction.customId.split('-');

    (async () => {
        if (splitInteraction[0] === 'role') {
            const client = interaction.client;
            const guild = await client.guilds.fetch(interaction.guildId);
            const member = interaction.member;
            const role = await guild.roles.fetch(splitInteraction[1]);

            if (member.roles.cache.find(r => r.id === splitInteraction[1])) {
                try {
                    member.roles.remove(splitInteraction[1]);
                    await interaction.reply({ content: `Removed role ${role} from ${interaction.user}!`, ephemeral: true });
                }
                catch {
                    await interaction.reply({ content: 'An error has occurred and the role was not removed. Likely I don\'t have the needed permissions!', ephemeral: true });
                }
            }
            else {
                try {
                    member.roles.add(splitInteraction[1]);
                    await interaction.reply({ content: `Added role ${role} to ${interaction.user}!`, ephemeral: true });
                }
                catch {
                    await interaction.reply({ content: 'An error has occurred and the role was not added. Likely I don\'t have the needed permissions!', ephemeral: true });
                }
            }
        }
    })();
    return;
};

module.exports = {
    name: Events.InteractionCreate,
    buttonInteraction,
};