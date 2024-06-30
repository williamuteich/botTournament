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
        .addFields({ name: 'Para se registrar, Digite o comando:', value: '/register-invocador', inline: true })
        .setTimestamp();
}

function showInvocador(data, matchInfo) {
    console.log("resultado", matchInfo)
    let win;

    let gameDurationSeconds = matchInfo.gameDuration;
    let minutes = Math.floor(gameDurationSeconds / 60);
    let seconds = gameDurationSeconds % 60;
    
    
    if (data.win === true) {
        win = ':green_circle:';
    } else {
        win = ':red_circle:';
    }
    
    return {
        color: 5763719,
        title: `${data.riotIdTagline}#${data.riotIdTagline}`,
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
                name: 'Level:',
                value: '240',
            },
            {
                inline: true,
                name: 'Champ/Main:',
                value: 'Yone',
            },
            {
                inline: true,
                name: 'Elo:',
                value: 'Gold',
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: true,
            },
            {
                inline: false,
                name: `${win} ${matchInfo.gameMode}`,
                value: `\n\`\`\`* ${data.championName}/${data.role} - ${minutes}:${seconds}\n\n Kill: ${data.kills} || Mortes: ${data.deaths} || Assist: ${data.assists}\n Gold: ${data.goldEarned} || Dano: ${data.totalDamageDealtToChampions} \n\`\`\``,
            },
            {
                inline: false,
                name: ':green_circle:  Ranked',
                value: '\n\`\`\`* Yasuo/Mid\n\n Kill: 12 || Mortes: 5 || Assist: 21\n Gold: 16521 || Dano: 34200 ||\n\`\`\`',
            },
            {
                inline: false,
                name: ':green_circle:  Normal',
                value: '\n\`\`\`* Shaco/Jungle\n\n Kill: 12 || Mortes: 5 || Assist: 21\n Gold: 16521 || Dano: 34200 ||\n\`\`\`',
            },
            {
                inline: false,
                name: ':red_circle:  ARAM',
                value: '\n\`\`\`* Tristana/Adc\n\n Kill: 12 || Mortes: 5 || Assist: 21\n Gold: 16521 || Dano: 34200 ||\n\`\`\`',
            },
            {
                inline: false,
                name: ':red_circle:  Ranked',
                value: '\n\`\`\`* Pyke/Sup\n\n Kill: 12 || Mortes: 5 || Assist: 21\n Gold: 16521 || Dano: 34200 ||\n\`\`\`',
            },
        ],
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
