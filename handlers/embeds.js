const { EmbedBuilder } = require('discord.js');

function createRegisterEmbed() {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Registre-se!')
        .setDescription('Cadastre-se para poder utilizar os comandos do bot Tournament!')
        .setThumbnail('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
        .addFields({ name: 'Para se registrar, Digite o comando:', value: '/register', inline: true })
        .setTimestamp();
}

function createRegisterInvocadorEmbed() {
    return new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('Registre os dados do seu invocador!')
        .setDescription('Registre os dados do seu invocador.')
        .setThumbnail('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
        .addFields({ name: 'Para se registrar, Digite o comando:', value: '/addinvocador', inline: true })
        .setTimestamp();
}

function showInvocador(partidas, invocadorData) {
    const jogador = partidas.flatMap(partida => partida.info.participants)
                           .find(participante => participante.puuid === invocadorData.puuid);

    if (!jogador) {
        throw new Error(`Jogador com puuid ${invocadorData.puuid} não encontrado nas partidas.`);
    }

    const riotIdGameName = jogador.riotIdGameName;
    const riotIdTagline = jogador.riotIdTagline;

    const embedFields = partidas.map(partida => {
        const jogadorPartida = partida.info.participants.find(participante => participante.puuid === invocadorData.puuid);
        const gameMode = partida.info.gameMode;
        const win = jogadorPartida.win;

        const gameDurationSeconds = partida.info.gameDuration;
        const minutes = Math.floor(gameDurationSeconds / 60);
        const seconds = gameDurationSeconds % 60;

        const emoji = win ? ':green_circle:' : ':red_circle:';

        return {
            inline: false,
            name: `${emoji} ${gameMode}`,
            value: `\n\`\`\`${jogadorPartida.championName}/${jogadorPartida.teamPosition} - ${minutes}:${seconds}\n\n Kill: ${jogadorPartida.kills} | Mortes: ${jogadorPartida.deaths} | Assist: ${jogadorPartida.assists}\n Farm: ${jogadorPartida.totalMinionsKilled} | Wards: ${jogadorPartida.wardsPlaced} \n Dano: ${jogadorPartida.totalDamageDealtToChampions} | Gold: ${jogadorPartida.goldEarned}\n\`\`\``,
        };
    });

    return {
        color: 5763719,
        title: `${riotIdGameName}#${riotIdTagline}`,
        author: {
            name: 'League of Legends',
        },
        description: 'Histórico de Partidas',
        thumbnail: {
            url: 'https://i.pinimg.com/736x/d1/b1/1d/d1b11d5e4dbae547ac0d651476cec488.jpg',
        },
        fields: embedFields,
        image: {
            url: 'https://c.wallhere.com/photos/a5/92/Soul_Fighter_League_of_Legends_video_games_GZG_4K_Riot_Games_digital_art_League_of_Legends_Sett_League_of_Legends-2252644.jpg!d',
        },
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Partidas Atualizadas',
            icon_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXrRZULzkZxxyhfNb6g44YXq6l-vS3eQqmz0fdrVne4GNajAnT2ulVyPszCQgpwmjTlRg&usqp=CAU',
        },
    };
}

module.exports = {
    createRegisterEmbed,
    createRegisterInvocadorEmbed,
    showInvocador
};
