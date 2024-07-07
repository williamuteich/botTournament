const { SlashCommandBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;
const riotMatchV5 = require('../api/apiRiotAccounts').riotMatchV5;
const riotMatchData = require('../api/apiRiotAccounts').riotMatchData;
const { showInvocador } = require('../handlers/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invocador')
        .setDescription('Mostra as últimas partidas do jogador.'),

    async execute(interaction) {
        try {
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: false });
            }

            const db = dbConnection.db();
            const invocadorCollection = db.collection('invocadores');

            const invocadorData = await invocadorCollection.findOne({ userDiscord: interaction.user.id });


            if (invocadorData) {
                const imagemInvocador = interaction.user.avatarURL()
                const retornoApi = await riotMatchV5(invocadorData.puuid, 5);
                const returnMatch = await riotMatchData(retornoApi);

                if (Array.isArray(returnMatch)) {
                    const exampleEmbed = showInvocador(returnMatch, invocadorData, imagemInvocador);
                    await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
                } 
            } 
        } catch (error) {
            console.error('Erro ao buscar o invocador no banco de dados:', error);
            if (interaction.deferred) {
                await interaction.editReply('Dados do invocador incorretos ou não existente.');
            }
        }
    }
};
