const { REST, Routes } = require("discord.js");
const dbConnection = require('./database/discordDatabase').client;
const fs = require("node:fs");
const path = require("node:path");

const dotenv = require('dotenv');
dotenv.config();
const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const db = dbConnection.db();
const commandsCollection = db.collection("botCommands");

const commands = [];

for (const file of commandFiles) { 
   const command = require(`./commands/${file}`);

   const commandName = command.data.name;
   const commandDescription = command.data.description;

   const existingCommand = commandsCollection.findOne({ name: commandName });

   if (existingCommand) {
       console.log(`Comando ${commandName} já existe no banco de dados. Pulando a inserção.`);
   } else {
       commandsCollection.insertOne({ name: commandName, description: commandDescription });
       console.log(`Comando ${commandName} inserido no banco de dados.`);
   }
   
   commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Registrando ${commands.length} comandos...`);

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log("Comandos registrados com sucesso!");
    }
    catch (error) {
        console.error(error);
    }
})();
