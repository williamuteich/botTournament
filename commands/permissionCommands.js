const { SlashCommandBuilder, ChannelSelectMenuBuilder, UserSelectMenuBuilder, ActionRowBuilder, ChannelType, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("permissao")
        .setDescription('Selecione o seu comando e o canal.'),

    async execute(interaction) {
        try {
            let selectedChannels = [];
            let selectedUsers = [];

            const channelSelect = new ChannelSelectMenuBuilder()
                .setCustomId('channels')
                .setPlaceholder('Selecione múltiplos canais de texto.')
                .setMinValues(1)
                .setMaxValues(10)
                .setChannelTypes(ChannelType.GuildText);

            const rowActionSelect = new ActionRowBuilder().addComponents(channelSelect);

            await interaction.reply({
                content: 'Selecione os canais de texto:',
                components: [rowActionSelect],
            });

            const channelCollector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.SELECT_MENU,
                filter: (i) => i.user.id === interaction.user.id && i.customId === 'channels',
                time: 60000 
            });

            channelCollector.on('collect', async (channelInteraction) => {
                selectedChannels = selectedChannels.concat(channelInteraction.values); // Concatena os IDs dos canais selecionados

                const userSelect = new UserSelectMenuBuilder()
                    .setCustomId('users')
                    .setPlaceholder('Selecione múltiplos usuários.')
                    .setMinValues(1)
                    .setMaxValues(10);

                const rowUserSelect = new ActionRowBuilder().addComponents(userSelect);

                await channelInteraction.reply({
                    content: 'Selecione os usuários:',
                    components: [rowUserSelect],
                });

                const userCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.SELECT_MENU,
                    filter: (i) => i.user.id === interaction.user.id && i.customId === 'users',
                    time: 60000 
                });

                userCollector.on('collect', async (userInteraction) => {
                    selectedUsers = selectedUsers.concat(userInteraction.values); 

                    await userInteraction.reply(`Você selecionou os canais com IDs: ${selectedChannels.join(', ')} e os usuários com IDs: ${selectedUsers.join(', ')}`);

                    channelCollector.stop();
                    userCollector.stop();
                });
            });

            // Lidar com erros
            channelCollector.on('end', () => {
                if (selectedChannels.length === 0) {
                    interaction.followUp('Você não selecionou nenhum canal de texto. O comando foi cancelado.');
                }
            });

        } catch (error) {
            console.error('Erro ao executar o comando:', error);
            await interaction.reply('Ocorreu um erro ao executar o comando. Por favor, tente novamente mais tarde.');
        }
    },
};
