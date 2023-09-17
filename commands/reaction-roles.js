/*
*  Konpeki Discord Bot - Slash Command Definition File
*  reaction-roles.js - A utility for adding reaction roles via the Select Menu component
*  See https://discord.com/developers/docs/interactions/message-components#select-menus
*
*  PLEASE NOTE: This code is a certified mess. It is readable to someone with some knowledge, but be warned this is not a great template for new commands to be based on.
*/

const { ChannelSelectMenuBuilder, RoleSelectMenuBuilder, SlashCommandBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

let nullResponse, nullCheckResponse, channelID, roleArray, embedTitle, embedDescription, embedColor, embedFooter;

// The following is a list of all possible content embeds the bot will go through when setting up reaction roles.
// Despite the variable name, this isn't an array. It's easy to refer to it that way however.
// For the actual code, scroll down to "module.exports".
// For a list of component rows, scroll down to "rowArray"
// For a list of components, scroll down to "componentArray"
const embedArray = {
    'interactionStart':
        // This is the introduction embed. There will be commented out unused embed functions so that this may be referenced for other embeds.
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            // .setURL('https://discord.js.org/')
            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Welcome to the Reaction Role Setup Wizard!')
            // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Using this wizard', value: 'Throughout this setup wizard, you will be asked to fill out information. After completing a page, hit the Next button to continue.\nYou can also return to a previous page with the Back Button. Using this button will reset the page you were on, and the page you moved to, so only use it if you need to.' },
                // { name: '\u200B', value: '\u200B' },
                // { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Please Note', value: 'There is a theoretical maximum of 15 minutes to finish setup.\nAfter 15 minutes from use of the command, this interaction will stop working.', inline: true },
            ),
    // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    // .setImage('https://i.imgur.com/AfFp7pu.png')
    // .setTimestamp()
    // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' }),

    'channelSelect':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('Please choose the channel to create the reaction role message in.'),
    'roleSelect':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('Please choose the roles for the reaction message.\nPlease note: There is a hard limit of 25 roles per message. This is a Discord limitation.'),
    'preEmbedModal':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('A popup will appear on the next page. Please fill out the information requested.\nIf you accidently close the popup, come back to this page then click Next again to reopen it.'),
    'embedModal':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('A popup should have appeared. Please fill out the information requested.\nIf you accidently closed the popup, go back a page then click Next again to reopen it.'),
    'postEmbedModal':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('If you accidently closed the popup, return now. Otherwise, continue.'),
    'finalStatus':
        new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Setup Wizard')
            .setDescription('Welcome to the Reaction Role Setup Wizard!')
            .addFields(
                { name: 'Using this wizard', value: 'Throughout wizard, you will be asked to fill out information. After completing a page, hit the Next button to continue.\nYou can also return to a previous page with the Back Button. Using this button will reset the page you were on, and the page you moved to, so only use it if you need to.' },
                { name: 'Please Note', value: 'There is a theoretical maximum of 15 minutes to finish setup.\nAfter 15 minutes from use of the command, this interaction will stop working.', inline: true },
            ),
};

// The following is a list of all possible component rows the bot will go through when setting up reaction roles.
// Despite the variable name, this isn't an array. It's easy to refer to it that way however.
// For the actual code, scroll down to "module.exports".
// For a list of content embeds, scroll up to "embedArray"
// For a list of components, scroll down to "componentArray"
const rowArray = {
    'introButtonRow':
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('Begin')
                    .setStyle('Primary'),
            ),
    'navigationButtonRow':
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previousPage')
                    .setLabel('Back')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('Next')
                    .setStyle('Primary'),
            ),
    'modalNextButtonRow':
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previousPage')
                    .setLabel('Back')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('nextPageWithModal')
                    .setLabel('Next')
                    .setStyle('Primary'),
            ),
    'modalPreviousToFinishRow':
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previousPageWithModal')
                    .setLabel('Back')
                    .setStyle('Danger'),
                new ButtonBuilder()
                    .setCustomId('finalPage')
                    .setLabel('Next')
                    .setStyle('Primary'),
            ),
    'finalButtonRow':
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previousPage')
                        .setLabel('Back')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('finishButton')
                        .setLabel('Finish')
                        .setStyle('Success'),
                ),
    'channelListSelectRow':
            new ActionRowBuilder()
                .addComponents(
                    new ChannelSelectMenuBuilder({
                        custom_id: 'channelSelect',
                        max_values: 1,
                        min_values: 1,
                        channel_types: [ChannelType.GuildText],
                    }),
                ),
    'roleListSelectRow':
        new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder({
                    custom_id: 'roleSelect',
                    max_values: 25,
                    min_values: 1,
                }),
            ),
    'embedModal':
        new ModalBuilder()
            .setCustomId('embedModal')
            .setTitle('Write a message to go alongside the roles')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('embedTitle')
                        .setLabel('Title')
                        .setValue('Pick your roles!')
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(40)
                        .setRequired(true),
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('embedDescription')
                        .setLabel('Description / Information / Funny Quip')
                        .setValue('Click the buttons below to be assigned the listed role.')
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1000)
                        .setRequired(true),
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('embedColor')
                        .setLabel('Accent Color (Optional) - Use hexcodes, no #.')
                        .setValue('00FFFF')
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(6)
                        .setMaxLength(6)
                        .setRequired(false),
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('embedFooter')
                        .setLabel('Footer (Optional)')
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(40)
                        .setRequired(false),
                ),
            ),
};

// The following is a list of all possible pages the bot will go through when setting up reaction roles.
// Despite the variable name, this isn't an array. It's easy to refer to it that way however.
// For the actual code, scroll down to "module.exports".
// For a list of content embeds, scroll up to "embedArray"
// For a list of component rows, scroll up to "rowArray"
const componentArray = {
    'interactionStart': {
        'content': '',
        'embeds': [embedArray.interactionStart],
        'rows': [rowArray.introButtonRow],
        'files': [],
    },
    'channelSelect': {
        'content': '',
        'embeds': [embedArray.channelSelect],
        'rows': [rowArray.channelListSelectRow, rowArray.navigationButtonRow],
        'files': [],
    },
    'roleSelect': {
        'content': '',
        'embeds': [embedArray.roleSelect],
        'rows': [rowArray.roleListSelectRow, rowArray.navigationButtonRow],
        'files': [],
    },
    'preEmbedModal': {
        'content': '',
        'embeds': [embedArray.preEmbedModal],
        'rows': [rowArray.modalNextButtonRow],
        'files': [],
    },
    'embedModal': {
        'content': '',
        'embeds': [embedArray.embedModal],
        'rows': [rowArray.navigationButtonRow],
        'files': [],
    },
    'postEmbedModal': {
        'content': '',
        'embeds': [embedArray.postEmbedModal],
        'rows': [rowArray.modalPreviousToFinishRow],
        'files': [],
    },
    'finalStatus': {
        'content': '\nPlease Note: If *any* required items are incomplete, creating the reaction roles will silently fail. Ye be warned!',
        'embeds': [],
        'rows': [rowArray.finalButtonRow],
        'files': [],
    },
};

// This is a full list of all the pages to navigate through. Needs to match names in componentArray.
const pages = [componentArray.interactionStart, componentArray.channelSelect, componentArray.roleSelect, componentArray.preEmbedModal, componentArray.embedModal, componentArray.postEmbedModal, componentArray.finalStatus];

// This is a full list of all the modals to navigate through. Needs to match names in componentArray.
const modals = [null, null, null, null, rowArray.embedModal, null, null];

// This is the actual logic that runs the reaction role creation script.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-roles')
        .setDescription('Setup Reaction Roles in a Channel (Manage Roles Required)'),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            interaction.reply({ content: 'You do not have the Manage Roles Permission!', ephemeral: true });
        }

        let currPage = 0;

        const component = pages[currPage];
        const initiatingUser = interaction.user.id;

        const response = await interaction.reply({
            content: component.content,
            embeds: component.embeds,
            components: component.rows,
            files: component.files,
            ephemeral: true,
        });

        const filter = i => i.user.id === initiatingUser;

        const collector = response.createMessageComponentCollector({ filter, time: 900_000 });

        collector.on('collect', async i => {

            if (i.customId === 'nextPage') {
                nullResponse = await this.validityCheck(currPage, interaction);
                currPage = nullResponse[0];
                i.deferUpdate();
                this.editReply(interaction, pages[currPage], nullResponse[1]);
            }

            if (i.customId === 'nextPageWithModal') {
                currPage += 1;
                i.showModal(modals[currPage]);
                this.editReply(interaction, pages[currPage], '');
                i.awaitModalSubmit({ time: 900_000, filter })
                    .then(async modalInteraction => {
                        embedTitle = modalInteraction.fields.getTextInputValue('embedTitle');
                        embedDescription = modalInteraction.fields.getTextInputValue('embedDescription');
                        embedColor = modalInteraction.fields.getTextInputValue('embedColor');
                        embedFooter = modalInteraction.fields.getTextInputValue('embedFooter');
                        modalInteraction.reply({ content: 'Submitted! This message should disappear shortly.', ephemeral: true });
                        await wait(2000);
                        modalInteraction.deleteReply();
                    })
                    // Cheat way of not logging errors when the modal expires
                    .catch(() => null);
            }

            if (i.customId === 'previousPage') {
                currPage -= 1;
                i.deferUpdate();
                this.editReply(interaction, pages[currPage], '');
            }

            if (i.customId === 'previousPageWithModal') {
                currPage -= 1;
                i.showModal(modals[currPage]);
                this.editReply(interaction, pages[currPage], '');
                i.awaitModalSubmit({ time: 900_000, filter })
                    .then(async modalInteraction => {
                        embedTitle = modalInteraction.fields.getTextInputValue('embedTitle');
                        embedDescription = modalInteraction.fields.getTextInputValue('embedDescription');
                        embedColor = modalInteraction.fields.getTextInputValue('embedColor');
                        embedFooter = modalInteraction.fields.getTextInputValue('embedFooter');
                        modalInteraction.reply({ content: 'Submitted! This message should disappear shortly.', ephemeral: true });
                        await wait(2000);
                        modalInteraction.deleteReply();
                    })
                    // Cheat way of not logging errors when the modal expires
                    .catch(() => null);
            }

            if (i.customId === 'finalPage') {
                currPage += 1;
                i.deferUpdate();
                nullCheckResponse = await this.finalCheck();
                this.editReply(interaction, pages[currPage], 'You\'ve reached the last page!\nBelow is a status readout. Please ensure all non-optional items are marked Green. If a required item is marked Red, go back and start from that page again.\n\n' + nullCheckResponse);
            }

            if (i.customId === 'finishButton') {
                i.deferUpdate();
                interaction.deleteReply();
                this.createReactRoleMessage(interaction);
            }

            // Second Page: Determine the channel for the role message
            if (i.customId === 'channelSelect') {
                channelID = i.values[0];
                i.deferUpdate();
            }

            // Third Page: Determine the roles for the message
            if (i.customId === 'roleSelect') {
                roleArray = i.values;
                i.deferUpdate(interaction);
            }
        });
    },

    async editReply(interaction, component, additionalContent) {
        await interaction.editReply({
            content: additionalContent + component.content,
            embeds: component.embeds,
            components: component.rows,
            files: component.files,
        });
    },

    async validityCheck(currentPage, interaction) {
        switch (currentPage) {
            case 1:
                if (!channelID) {
                    return [currentPage, 'Please enter a response! If you have, please wait a second and try again.\n'];
                }
                if (!interaction.guild.members.me.permissionsIn(interaction.client.channels.cache.get(channelID)).has(PermissionsBitField.Flags.SendMessages)) {
                    return [currentPage, 'Missing the Send Messages permission in that channel. Please ensure the bot has the proper permissions to talk in that channel.\n'];
                }
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    return [currentPage, 'You are missing the Send Messages permission in that channel. Please ensure you have the proper permissions to talk in that channel.\n'];
                }
                break;
            case 2:
                if (!roleArray) {
                    return [currentPage, 'Please enter a response! If you have, please wait a second and try again.\n'];
                }
                for (const roleIndex in roleArray) {
                    const role = await interaction.guild.roles.fetch(roleArray[roleIndex]);
                    if (interaction.guild.ownerId != interaction.member.id) {
                        if (interaction.member.roles.highest.position < role.position) {
                            return [currentPage, `The role ${role.name} is higher in the role hierarchy than your highest role. Please ensure you have the proper permissions to modify this role.\n`];
                        }
                    }
                }
                break;
            case 4:
                if (!embedTitle) {
                    return [currentPage, 'Please enter a response to both required questions! If you have, please wait a second and try again.\n'];
                }
                if (!embedDescription) {
                    return [currentPage, 'Please enter a response to both required questions! If you have, please wait a second and try again.\n'];
                }
                break;
            default:
                return [currentPage + 1, ''];
        }
        return [currentPage + 1, ''];
    },

    async finalCheck() {
        let content = ':green_circle: - No Problems\n:red_circle: - Missing Information\n\n';
        if (!channelID) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Channel to Send Message In\n';
        if (!roleArray) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Roles to Allow Self-Assignment\n';
        if (!embedTitle) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Title for the Message\n';
        if (!embedDescription) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Description for the Message\n';
        if (!embedColor) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Color for the Message (Optional)\n';
        if (!embedFooter) {
            content += ':red_circle:';
        }
        else {
            content += ':green_circle:';
        }
        content += ' Footer for the Message (Optional)\n';
        return content;
    },

    async getButtonLayout(numberOfRoles) {
        const rowCount = (numberOfRoles / 5) >> 0;
        const lesserButtonCount = numberOfRoles % 5;

        // -1 allows for the last row to be custom made to support the non full row count
        return [rowCount - 1, lesserButtonCount];
    },

    async createReactRoleMessage(interaction) {
        const client = interaction.client;
        const guild = await client.guilds.fetch(interaction.guildId);
        const embedChannel = client.channels.cache.get(channelID);
        const buttonCount = await this.getButtonLayout(roleArray.length);

        const reactionEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(embedTitle)
            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription(embedDescription);

        if (embedFooter) {
            reactionEmbed.setFooter({ text: embedFooter });
        }

        const rowComponents = [];

        let rows = 0;
        let remainder = 0;

        while (rows <= buttonCount[0]) {
            rowComponents.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('role-' + roleArray[0 + (5 * rows)])
                            .setLabel((await guild.roles.fetch(roleArray[0 + (5 * rows)])).name)
                            .setStyle('Primary'),
                        new ButtonBuilder()
                            .setCustomId('role-' + roleArray[1 + (5 * rows)])
                            .setLabel((await guild.roles.fetch(roleArray[1 + (5 * rows)])).name)
                            .setStyle('Primary'),
                        new ButtonBuilder()
                            .setCustomId('role-' + roleArray[2 + (5 * rows)])
                            .setLabel((await guild.roles.fetch(roleArray[2 + (5 * rows)])).name)
                            .setStyle('Primary'),
                        new ButtonBuilder()
                            .setCustomId('role-' + roleArray[3 + (5 * rows)])
                            .setLabel((await guild.roles.fetch(roleArray[3 + (5 * rows)])).name)
                            .setStyle('Primary'),
                        new ButtonBuilder()
                            .setCustomId('role-' + roleArray[4 + (5 * rows)])
                            .setLabel((await guild.roles.fetch(roleArray[4 + (5 * rows)])).name)
                            .setStyle('Primary'),
                    ),
            );
            rows += 1;
        }

        const reminaderRow = new ActionRowBuilder();

        while (remainder < buttonCount[1]) {
            reminaderRow.addComponents(
                new ButtonBuilder()
                    .setCustomId('role-' + roleArray[remainder + (5 * rows)])
                    .setLabel((await guild.roles.fetch(roleArray[remainder + (5 * rows)])).name)
                    .setStyle('Primary'),
            ),
            remainder += 1;
        }

        rowComponents.push(reminaderRow);

        embedChannel.send({
            content: '',
            embeds: [reactionEmbed],
            components: rowComponents,
            files: [],
        });
    },
};