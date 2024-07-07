const { SlashCommandBuilder } = require('discord.js');
const { UserSelectMenuBuilder, ChannelSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission')
        .setDescription('Selecione o seu comando e o canal.'),
    async execute(interaction) {
        const db = dbConnection.db();
        const invocadorCollection = db.collection('invocadores');

        // Simulando a obtenção dos invocadores (substitua com a lógica real se necessário)
        const invocadores = await invocadorCollection.find({}).toArray();
        console.log("Dados dos invocadores:", invocadores);

        // Construindo o select para usuários
        const userSelect = new UserSelectMenuBuilder()
            .setCustomId('users')
            .setPlaceholder('Selecione um ou mais usuários.')
            .setMinValues(1)
            .setMaxValues(10);

        // Construindo o select para canais de texto
        const channels = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
        const channelOptions = channels.map(channel => ({
            label: channel.name.substring(0, 25), // Limitando o label a 25 caracteres
            value: channel.id,
        }));

        const channelSelect = new ChannelSelectMenuBuilder()
            .setCustomId('channels')
            .setPlaceholder('Selecione um canal de texto.');

        // Adicionando as opções ao select de canais de texto
        channelOptions.forEach(option => {
            channelSelect.addOption(option.label, option.value);
        });

        // Construindo as linhas de ação (action rows) para os selects
        const row1 = new ActionRowBuilder()
            .addComponents(userSelect);

        const row2 = new ActionRowBuilder()
            .addComponents(channelSelect);

        // Respondendo à interação com os selects
        await interaction.reply({
            content: 'Selecione os usuários e um canal de texto:',
            components: [row1, row2],
        });
    },
};
