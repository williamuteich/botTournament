const { SlashCommandBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;
const riotMatchV5 = require('../api/apiRiotAccounts').riotMatchV5;
const riotMatchData = require('../api/apiRiotAccounts').riotMatchData;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recents')
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
        const db = dbConnection.db();
        const invocadorCollection = db.collection('invocadores');

        try {
            const invocadorData = await invocadorCollection.findOne({ userDiscord: interaction.user.id });

            if (invocadorData) {
                const retornoApi = await riotMatchV5(invocadorData.puuid);
                const returnMatch = await riotMatchData(retornoApi);

               for (const participante of returnMatch.info.participants) {
                    if (participante.puuid === invocadorData.puuid) {
                        console.log("participante>>>", participante)
                        interaction.reply('Você participou da partida.', participante);
                    }
               }
            }
        } catch (error) {
            console.error('Erro ao buscar o invocador no banco de dados:', error);
            return interaction.reply('Ocorreu um erro ao buscar seus dados de invocador.');
        }
    }
};
