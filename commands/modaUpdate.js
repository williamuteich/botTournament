const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Atualize Os Seus Dados.'),

    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
                .setCustomId('ModalUpdate')
                .setTitle('Atualize Os Seus Dados.');

            const nomeInput = new TextInputBuilder()
                .setCustomId('nomeInput')
                .setLabel("nome")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const sobrenomeInput = new TextInputBuilder()
                .setCustomId('sobrenomeInput')
                .setLabel("sobrenome")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const cpfInput = new TextInputBuilder()
                .setCustomId('cpfInput')
                .setLabel('CPF: ex: 12345678900')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const emailInput = new TextInputBuilder()
                .setCustomId('emailInput')
                .setLabel('Email')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
            const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
            const emailUsuario = new ActionRowBuilder().addComponents(emailInput);
            const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput);

            modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario);

            await interaction.showModal(modal);

        } catch (error) {
            console.error('Erro Ao Tentar Atualizar Registro:', error);
            await interaction.reply({ content: 'Ocorreu Um Erro Ao Tentar Atualizar o Registro. Por Favor, Tente Novamente Mais Tarde.', ephemeral: true });
        }
    }
}