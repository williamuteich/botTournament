const { SlashCommandBuilder } = require('discord.js');
const fetchRiotAccount = require('../api/apiRiotAccounts').fetchRiotAccount;
const dbConnection = require('../database/discordDatabase').client;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addinvocador')
        .setDescription('Registrar os dados do seu invocador.')
        .addStringOption(option => option
            .setName('gamename')
            .setDescription('ex: Farofinha')
            .setRequired(true))
        .addStringOption(option => option
            .setName('tagline')
            .setDescription('ex: 1254')
            .setRequired(true)),

    async execute(interaction) {
        try {
            const db = dbConnection.db();
            const invocadorCollection = db.collection('invocadores');
            const gameName = interaction.options.getString('gamename');
            const tagLine = interaction.options.getString('tagline');

            const verificaInvocador = await invocadorCollection.findOne({ userDiscord: interaction.user.id });

            if (verificaInvocador) {
                await interaction.reply('Você já possui um invocador registrado. Caso deseje alterar, utilize o comando /updateinvocador.');
                return;
            }
            const resultRiot = await fetchRiotAccount(gameName, tagLine)
            
            await invocadorCollection.insertOne({
                userDiscord: interaction.user.id,
                gameName,
                tagLine,
                puuid: resultRiot.puuid,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            await interaction.reply(`Invocador ${gameName}#${tagLine} foi registrado com sucesso!`);
        } catch (error) {
            console.error('Erro ao iniciar registro:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Ocorreu um erro ao iniciar o registro. Por favor, tente novamente mais tarde.', ephemeral: true });
            }
        }
    },
};
