const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invocador')
        .setDescription('Mostra o histórico de partidas.'),

    async execute(interaction) {
        try {
            await interaction.reply("resposta do comando 'invocador'");
        } catch (error) {
            console.error('Erro ao executar o comando invocador:', error);
        }
    }
}
