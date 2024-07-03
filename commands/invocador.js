const { SlashCommandBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;
const riotMatchV5 = require('../api/apiRiotAccounts').riotMatchV5;
const riotMatchData = require('../api/apiRiotAccounts').riotMatchData;
const fetchRiotAccount = require('../api/apiRiotAccounts').fetchRiotAccount;
const { showInvocador } = require('../handlers/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invocador')
        .setDescription('Mostra as últimas partidas do jogador.')
        .addStringOption(option =>
            option.setName('gamename')
                .setDescription('Ex: Farofinha')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('tagline')
                .setDescription('Ex: BR1')
                .setRequired(false)),

    async execute(interaction) {
        try {

            if (!interaction.deferred) {
                await interaction.deferReply({ ephemeral: false });
            }

            const promptName = interaction.options.getString('gamename');
            const promptTag = interaction.options.getString('tagline');
            const db = dbConnection.db();
            const invocadorCollection = db.collection('invocadores');

            const invocadorData = await invocadorCollection.findOne({ userDiscord: interaction.user.id });

            if(promptName && !promptTag || !promptName && promptTag) {
                await interaction.editReply('Você precisa informar o nome e a tag do invocador.');
                return;
            }

            if (invocadorData && !promptName && !promptTag) {
                const retornoApi = await riotMatchV5(invocadorData.puuid);
                const returnMatch = await riotMatchData(retornoApi, 5);

                if (Array.isArray(returnMatch)) {
                    const exampleEmbed = showInvocador(returnMatch, invocadorData);
                    await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
                } 
            } else if(promptName && promptTag) {
                const buscaPuuid = await fetchRiotAccount(promptName, promptTag);
                const retornoApi = await riotMatchV5(buscaPuuid.puuid);
                const returnMatch = await riotMatchData(retornoApi, 5);

                if (Array.isArray(returnMatch)) {
                    const exampleEmbed = showInvocador(returnMatch, buscaPuuid);
                    await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
                } 
            } 

        } catch (error) {
            console.error('Erro ao buscar o invocador no banco de dados:', error);
            if (!interaction.deferred) {
                await interaction.editReply('Ocorreu um erro ao buscar seus dados de invocador.');
            }
        }
    }
};
