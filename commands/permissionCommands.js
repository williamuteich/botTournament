const { SlashCommandBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, ComponentType, ActionRowBuilder } = require('discord.js');
const dbConnection = require('../database/discordDatabase').client;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("permissao")
        .setDescription('Selecione o seu comando e o canal.'),

    async execute(interaction) {
        try {
            let selectedChannels = [];
            let selectedCommands = [];

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
                const nameChannels = channelInteraction.channels.map(channel => channel.name);
                selectedChannels = selectedChannels.concat(channelInteraction.values); 

                const db = dbConnection.db();
                const commandsCollection = db.collection('botCommands');
                const channelsCommandsCollection = db.collection('commandsChannels');
                const commandsDb = await commandsCollection.find({}).toArray();

                const commandOptions = commandsDb.map(command => (
                    new StringSelectMenuOptionBuilder()
                        .setLabel(command.name)
                        .setDescription(command.description)
                        .setValue(command.name)
                ));

                const commandSelect = new StringSelectMenuBuilder()
                    .setCustomId('commands')
                    .setPlaceholder('Selecione um comando.')
                    .addOptions(...commandOptions);

                const rowCommandSelect = new ActionRowBuilder().addComponents(commandSelect);

                await channelInteraction.reply({
                    content: 'Selecione um comando:',
                    components: [rowCommandSelect],
                });

                const commandCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.SELECT_MENU,
                    filter: (i) => i.user.id === interaction.user.id && i.customId === 'commands',
                    time: 60000 
                });

                commandCollector.on('collect', async (commandInteraction) => {
                    selectedCommands = selectedCommands.concat(commandInteraction.values); 

                    //const inserData = await channelsCommandsCollection.insertOne({
                    //    serverId: interaction.guild.id,
                    //    nameChannels,
                    //    channels: selectedChannels,
                    //    commands: selectedCommands
                    //})

                    const existingDocument = await channelsCommandsCollection.findOne({ serverId: interaction.guild.id, commands: selectedCommands });

                    if (existingDocument) {
                        await channelsCommandsCollection.updateOne(
                            { _id: existingDocument._id },
                            { $set: { nameChannels, commands: selectedCommands, channels: selectedChannels } }
                        );
                    } else {
                        await channelsCommandsCollection.insertOne({
                            serverId: interaction.guild.id,
                            nameChannels,
                            commands: selectedCommands,
                            channels: selectedChannels,
                        });
                    }

                    await commandInteraction.reply(`Você salvou os canais: " ${nameChannels.join(', ')} "  ==> comando: " ${selectedCommands.join(', ')} "`);

                    channelCollector.stop();
                    commandCollector.stop();
                });
            });

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
