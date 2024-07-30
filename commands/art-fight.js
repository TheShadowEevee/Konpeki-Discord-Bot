/*
*  Konpeki Discord Bot - Slash Command Definition File
*  art-fight.js - A small scale team art fight clone
*  See https://discord.com/developers/docs/interactions/message-components#select-menus
*
*  PLEASE NOTE: This code is a certified mess. It is readable to someone with some knowledge, but be warned this is not a great template for new commands to be based on.
*/

const { ChannelSelectMenuBuilder, RoleSelectMenuBuilder, SlashCommandBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;

// let nullResponse, nullCheckResponse, channelID, roleArray, embedTitle, embedDescription, embedColor, embedFooter;

// This is the actual logic that runs the reaction role creation script.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('art-fight')
        .setDescription('Team Art Fight Management Commands')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Set the title of the event')
                .setRequired(true),
        )
        .addChannelOption(option =>
            option.setName('rank-channel')
                .setDescription('Where to post the leaderboard')
                .setRequired(true)
                .addChannelTypes(0),
        )
        // .addStringOption()
        .addRoleOption(option =>
            option.setName('team1')
                .setDescription('Select a Role for Team 1')
                .setRequired(true),
        )
        .addUserOption(option =>
            option.setName('team1cap')
                .setDescription('Select a Captain for Team 1'),
        )
        .addRoleOption(option =>
            option.setName('team2')
                .setDescription('Select a Role for Team 2'),
        )
        .addUserOption(option =>
            option.setName('team2cap')
                .setDescription('Select a Captain for Team 2'),
        )
        .addRoleOption(option =>
            option.setName('team3')
                .setDescription('Select a Role for Team 3'),
        )
        .addUserOption(option =>
            option.setName('team3cap')
                .setDescription('Select a Captain for Team 3'),
        ),
    async execute(interaction) {

        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        //    interaction.reply({ content: 'You do not have the Manage Roles Permission!', ephemeral: true });
        // }

        // Get the selected channel from the command options
        const title = interaction.options.getString('title') ?? 'No Title.';
        const channel = interaction.options.getChannel('rank-channel') ?? null;
        const t1 = interaction.options.getRole('team1') ?? null;
        const t1c = interaction.options.getUser('team1cap') ?? null;
        const t2 = interaction.options.getRole('team2') ?? null;
        const t2c = interaction.options.getUser('team2cap') ?? null;
        const t3 = interaction.options.getRole('team3') ?? null;
        const t3c = interaction.options.getUser('team3cap') ?? null;

        try {
            // Next two lines credit to ChatGPT 4o Mini
            // Ensure all guild members are fetched
            await interaction.guild.members.fetch();

            // Get the members with the roles
            const t1members = (t1.members.size ? '' + (t1c ? t1.members.filter(member => member.id !== t1c.id).map(member => `<@${member.id}>`).join(', ') + '' : t1.members.map(member => `<@${member.id}>`).join(', ') + '') : '`No members`') ?? '`No members`';
            const t2members = (t2.members.size ? '' + (t2c ? t2.members.filter(member => member.id !== t2c.id).map(member => `<@${member.id}>`).join(', ') + '' : t2.members.map(member => `<@${member.id}>`).join(', ') + '') : '`No members`') ?? '`No members`';
            const t3members = (t3.members.size ? '' + (t3c ? t3.members.filter(member => member.id !== t3c.id).map(member => `<@${member.id}>`).join(', ') + '' : t3.members.map(member => `<@${member.id}>`).join(', ') + '') : '`No members`') ?? '`No members`';

            // Check if the required options are provided
            if (!channel || !t1) {
                await interaction.reply({ content: 'Required options are missing.', ephemeral: true });
                return;
            }

            // Check if the optional options are provided
            const t2Exists = !!t2; // Check if t3 is not null or undefined
            const t3Exists = !!t3; // Check if t3 is not null or undefined

            // Create a response message with channel details
            let response = `# ${title}\n`;
            response += `Leaderboard Channel: <#${channel.id}>\n\n`;
            response += `Team 1: <@&${t1.id}>\nCaptain: ${t1c ? `${t1c}` : 'No Captain'}\nMembers: ${t1members ? `${t1members}` : 'No Members'}\n\n`;
            response += t2Exists ? `Team 2: <@&${t2.id}>\nCaptain: ${t2c ? `${t2c}` : 'No Captain'}\nMembers: ${t2members ? `${t2members}` : 'No Members'}\n\n` : '';
            response += t3Exists ? `Team 3: <@&${t3.id}>\nCaptain: ${t3c ? `${t3c}` : 'No Captain'}\nMembers: ${t3members ? `${t3members}` : 'No Members'}\n\n` : '';
            await interaction.reply({ content: response, ephemeral: true });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while fetching role members.', ephemeral: true });
        }
    },
};