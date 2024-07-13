const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const schedule = require('node-schedule');
dotenv.config();
const { DISCORD_TOKEN } = process.env;

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute ausentes"`);
    }
}

const { createRegisterEmbed, createRegisterInvocadorEmbed } = require('./handlers/embeds');
const { handleModalRegister, handleModalUpdate } = require('./handlers/modalHandlers');
const checkInvocador = require('./query/checkedInvocador');
const isuserResult = require('./query/consultaUsers');
const { handleListRank } = require('./checkFunctions/listRank');

client.once(Events.ClientReady, c => {
    console.log(`O bot está online como ${c.user.tag}`);

    const rule = new schedule.RecurrenceRule();
    rule.hour = 15;
    rule.minute = 42;
    rule.tz = 'America/Sao_Paulo';
    const channelId = c.channels.cache.find(ch => ch.id === '1258927479100276808');

    schedule.scheduleJob(rule, async () => {
        await handleListRank(client, channelId); 
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        try {
            const validCommandsLol = ['invocador', 'recents'];
            const userDiscordId = interaction.user.id;
            const userServerDiscordID = interaction.guild.id;
            const serverName = interaction.guild.name;
            const invocadorIsRegistered = await checkInvocador(userDiscordId);
            const isRegistered = await isuserResult(userDiscordId, userServerDiscordID, serverName);
            
            if (isRegistered && interaction.commandName === 'register') {
                await interaction.reply("Você já está cadastrado.");
                return;
            }

            if (!isRegistered && interaction.commandName !== 'register') {
                const exampleEmbed = createRegisterEmbed();
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
                return;
            }

            if (!invocadorIsRegistered && validCommandsLol.includes(interaction.commandName)) {
                const exampleEmbed = createRegisterInvocadorEmbed();
                await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
                return;
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
        }
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isModalSubmit()) {
        const values = interaction.components;
        const mappedResponses = Array.isArray(values) ? values.map(response => response.components[0]?.value || '') : [];
        
        if (mappedResponses[3].length !== 11) {
            await interaction.reply("O CPF deve ter 11 dígitos");
            return;
        }

        if (interaction.customId === 'ModalRegister') {
            await handleModalRegister(interaction, mappedResponses);
        } else if (interaction.customId === 'ModalUpdate') {
            await handleModalUpdate(interaction, mappedResponses);
        }
    }
});

client.login(DISCORD_TOKEN);
