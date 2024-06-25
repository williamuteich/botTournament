const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { salvarUsuarios } = require('../query/saveUsers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Criar uma conta para utilizar o bot.'),
    async execute(interaction) {
        try {
            const nomeDiscord = interaction.user.globalName || interaction.user.username;
            const armazenaSaudacao = {
                [`Bom dia, ${nomeDiscord}! 🌞`]: [0, 12],
                [`Boa tarde, ${nomeDiscord}! 🌤️`]: [12, 18],
                [`Boa noite, ${nomeDiscord}! 🌙`]: [18, 24]
            };
        
            function obterSaudacao() {
                const horario = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
                const horas = parseInt(horario.split(' ')[1].split(':')[0], 10);
            
                for (const [saudacao, [inicio, fim]] of Object.entries(armazenaSaudacao)) {
                    if (horas >= inicio && horas < fim) {
                        return saudacao;
                    }
                }
                return "Olá"; 
            }

            const saudacao = obterSaudacao();

            const modal = new ModalBuilder()
                .setCustomId('ModalRegister')
                .setTitle(`${saudacao}`);

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

            const emailInput = new TextInputBuilder()
                .setCustomId('emailInput')
                .setLabel('Email')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
                
            const cpfInput = new TextInputBuilder()
                .setCustomId('cpfInput')
                .setLabel('CPF: ex: 12345678900')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
            const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
            const emailUsuario = new ActionRowBuilder().addComponents(emailInput);
            const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput);

            modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario);

            await interaction.showModal(modal);
            
        } catch (error) {
            console.error('Erro ao iniciar registro:', error);
            await interaction.reply({ content: 'Ocorreu um erro ao iniciar o registro. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    },
};
