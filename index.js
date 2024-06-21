const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv')
dotenv.config()
const { DISCORD_TOKEN} = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

client.once(Events.ClientReady, c => {
	console.log(`O bot está online como ${c.user.tag}`)
});

client.login(DISCORD_TOKEN)