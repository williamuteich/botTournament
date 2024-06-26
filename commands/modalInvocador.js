const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registerinvocador')
        .setDescription('Registrar os dados do seu invocador.')
        .addStringOption(option => option
            .setName('tagname')
            .setDescription('ex: Farofinha')
            .setRequired(true))
        .addStringOption(option => option
            .setName('tagline')
            .setDescription('ex: 1254')
            .setRequired(true)),

    async execute(interaction) {
        try {
            const tagName = interaction.options.getString('tagname');
            const tagLine = interaction.options.getString('tagline');
            console.log("tagName>>>>>", tagName);
            console.log("tagLine>>>>>", tagLine);
            await interaction.reply(`Registro do invocador: ${tagName}#${tagLine}`);
        } catch (error) {
            console.error('Erro ao iniciar registro:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Ocorreu um erro ao iniciar o registro. Por favor, tente novamente mais tarde.', ephemeral: true });
            }
        }
    },
};
