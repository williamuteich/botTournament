const { SlashCommandBuilder } = require('discord.js');
const { showInvocador } = require('../handlers/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('Testando o embed.'),

    async execute(interaction) {
        try {
            
            const exampleEmbed = showInvocador();

            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });

        } catch (error) {
            console.error('Erro ao tentar enviar o embed:', error);
            await interaction.reply({ content: 'Ocorreu um erro ao tentar enviar o embed. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
};
