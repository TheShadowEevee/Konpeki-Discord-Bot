[![GitHub](https://img.shields.io/github/license/TheShadowEevee/Konpeki-Discord-Bot)](https://github.com/TheShadowEevee/Konpeki-Discord-Bot/blob/master/LICENSE) [![GitHub repo size](https://img.shields.io/github/repo-size/TheShadowEevee/Konpeki-Discord-Bot)](https://github.com/TheShadowEevee/Konpeki-Discord-Bot) [![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/TheShadowEevee/Konpeki-Discord-Bot/discord.js)](https://discord.js.org/) [![CodeFactor](https://www.codefactor.io/repository/github/theshadoweevee/konpeki-discord-bot/badge)](https://www.codefactor.io/repository/github/theshadoweevee/konpeki-discord-bot) [![Discord](https://img.shields.io/discord/1052844258173931540?label=discord)](https://discord.gg/Zt8zruXexJ)
# Konpeki Discord Bot

Konpeki is a Discord Bot with varied functions. Written with discord.js, the Konpeki bot is designed to be easy to use and setup, as well as easy to change to work how you want it to. The name Konpeki comes from the Japenese word for Azure; there's no other reason for the name.

For general support, or to try out a live, public version of the bot, feel free to join the bot's [Discord Server](https://discord.gg/Zt8zruXexJ)!

The live version of the bot is `Konpeki Shiho#2603`, run by TheShadowEevee.


## Adding to your server

You can add the public bot, Konpeki Shiho, to your server [here](https://discord.com/oauth2/authorize?client_id=812862868721631272&permissions=275146345472&scope=bot%20applications.commands)!
 - Please note that currently Konpeki Shiho is *not* a verified bot due to lack of server membership. You can help get the bot verified by adding it to your server! Konpeki Shiho runs and updates directly off of the code from this repository, while development is done primarily against the private bot Little Shiho.

If you are running your own version of the Konpeki bot, change the Client ID in the link to your bot's Client ID  found in the Discord Developer portal. See [Running Locally](#Running-Locally) for more.
## Running Locally

These instructions will get you setup with a basic setup for development.
If you are running the bot as-is, it is recommended to use the [pm2](https://pm2.io/) process manager or a similar tool to keep the bot running unattended.

Before you begin, install these prerequisites:
 - [Node.js](https://nodejs.org/en/download/)
 - [Git](https://git-scm.com/downloads/)

#### ***Creating the bot on Discord***
The first step to setup any Discord bot is creating one in the [Discord Developer Portal](https://discord.com/developers/).

 - Go to the [Discord Developer Portal](https://discord.com/developers/)
 - Click New Application, name it, and press Create.
   - The Application ID on the page you are brought to is your Client ID. You will need this later.
 - Click the Bot tab on the left, then New Bot.
   - If you get an error saying too many users have this username, rename your application to something more unique.
 - Copy your bot's token somewhere *safe*.
   - Do not share this! This will give anyone access to your bot. Reset it immediatly if it becomes public.
   - If you lose the token, you will have to reset it and get a new one.

#### ***Configuring the bot***
Once you have created a bot, you need to configure it.

 - Clone the repositiory and move into the folder.
   ```bash
    git clone https://github.com/TheShadowEevee/Konpeki-Discord-Bot
    cd Konpeki-Discord-Bot
   ```
 - Copy `config.json.template` and name the new file `config.json`.
 - Fill in the `config.json` file with your bot's token, client id, and your username.

#### ***Running the bot***
Once your bot is created, run the below commands to clone and run the bot.

```bash
  # Install NPM dependencies
  npm install

  # Setup slash commands
  node deploy-commands.js

  # Run the bot
  node index.js
```

#### ***Updating the bot***
Update the bot periodically to ensure your up-to-date. 

If you're updating from Github:
  - Run `git pull` from the bot's folder
    - This will get the lastest updates from Github
  - Run `node delete-commands.js && node deploy-commands.js`
    - This will recreate all your slash commands to ensure they are up-to-date

If you're updating based on changes you made:
  - You only need to do this if you have created or deleted a file from the `commands` folder
  - Run `node delete-commands.js && node deploy-commands.js`
    - This will recreate all your slash commands to ensure they are up-to-date
