const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const dotenv = require('dotenv');
dotenv.config();
const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) { 
   const command = require(`./commands/${file}`);
   commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Registrando ${commands.length} comandos globalmente...`);

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log("Comandos registrados globalmente com sucesso!");
    }
    catch (error) {
        console.error(error);
    }
})();
