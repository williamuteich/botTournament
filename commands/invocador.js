const { SlashCommandBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;
const riotMatchV5 = require('../api/apiRiotAccounts').riotMatchV5;
const riotMatchData = require('../api/apiRiotAccounts').riotMatchData;
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
                await interaction.deferReply({ ephemeral: true });
            }
 
            const db = dbConnection.db();
            const invocadorCollection = db.collection('invocadores');

            const invocadorData = await invocadorCollection.findOne({ userDiscord: interaction.user.id });

            if (invocadorData) {
                const retornoApi = await riotMatchV5(invocadorData.puuid);
                const returnMatch = await riotMatchData(retornoApi);

                if (Array.isArray(returnMatch)) {
                    for (const partidas of returnMatch) {
                        if (partidas.info) {
                            for (const participante of partidas.info.participants) {
                                if (participante.puuid === invocadorData.puuid) {
                                    const exampleEmbed = showInvocador(participante);

                                    await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
                                    return; 
                                }
                            }
                        }
                    }
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
