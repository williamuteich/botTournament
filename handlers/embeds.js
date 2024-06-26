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

module.exports = {
    createRegisterEmbed,
    createRegisterInvocadorEmbed
};
