const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('Testando o embed.'),

    async execute(interaction) {
        try {
            const exampleEmbed = {
                color: 5763719,
                title: 'Crackudinho#1380',
                url: 'https://discord.js.org',
                author: {
                    name: 'League of Legends',
                },
                description: 'Histórico de Partidas',
                thumbnail: {
                    url: 'https://i.pinimg.com/736x/d1/b1/1d/d1b11d5e4dbae547ac0d651476cec488.jpg',
                },
                fields: [
                    {
                        inline: true,
                        name: 'Level',
                        value: '240',
                    },
                    {
                        inline: true,
                        name: 'Campeão Fav',
                        value: 'Yone',
                    },
                    {
                        inline: true,
                        name: 'Elo',
                        value: 'Gold',
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true,
                    },
                    {
                        name: '\u200b',
                        value: '```diff\n- Normal game: PIPIPIPOPOPO\n```',
                    },
                ],
                image: {
                    url: 'https://c.wallhere.com/photos/a5/92/Soul_Fighter_League_of_Legends_video_games_GZG_4K_Riot_Games_digital_art_League_of_Legends_Sett_League_of_Legends-2252644.jpg!d',
                },
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Últimas Partidas',
                    icon_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXrRZULzkZxxyhfNb6g44YXq6l-vS3eQqmz0fdrVne4GNajAnT2ulVyPszCQgpwmjTlRg&usqp=CAU',
                },
            };
            
            

            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });

        } catch (error) {
            console.error('Erro ao tentar enviar o embed:', error);
            await interaction.reply({ content: 'Ocorreu um erro ao tentar enviar o embed. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
};
