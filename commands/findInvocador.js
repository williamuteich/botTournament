const { SlashCommandBuilder } = require('discord.js');
const riotMatchV5 = require('../api/apiRiotAccounts').riotMatchV5;
const riotMatchData = require('../api/apiRiotAccounts').riotMatchData;
const fetchRiotAccount = require('../api/apiRiotAccounts').fetchRiotAccount;
const { showInvocador } = require('../handlers/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findinvocador')
        .setDescription('Mostra as últimas partidas do jogador.')
        .addStringOption(option =>
            option.setName('gamename')
                .setDescription('Ex: Farofinha')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tagline')
                .setDescription('Ex: BR1')
                .setRequired(true)),

    async execute(interaction) {
        try {

            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: false });
            }

            const promptName = interaction.options.getString('gamename');
            const promptTag = interaction.options.getString('tagline');

            if(promptName && promptTag) {
                const buscaPuuid = await fetchRiotAccount(promptName, promptTag);
                const retornoApi = await riotMatchV5(buscaPuuid.puuid, 5);
                const returnMatch = await riotMatchData(retornoApi);

                if (Array.isArray(returnMatch)) {
                    const exampleEmbed = showInvocador(returnMatch, buscaPuuid);
                    await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
                } 
            } 

        } catch (error) {
            console.error('Erro ao buscar ao tentar encontrar invocador:', error);
            if (interaction.deferred) {
                await interaction.editReply('Dados do invocador incorretos ou não existente.');
            }
        }
    }
};
