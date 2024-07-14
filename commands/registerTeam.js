const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inscricao")
        .setDescription("Registra um time no torneio.")
        .addStringOption(option => option
            .setName("nome")
            .setDescription("Nome do time")
            .setRequired(true)),

    async execute(interaction) {
        const nomeTime = interaction.options.getString("nome");
        await interaction.reply(`você realizou a inscrição do seu time com o nome ${nomeTime}.`);
    }
}