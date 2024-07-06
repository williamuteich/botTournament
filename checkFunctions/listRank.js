const dbConnection = require('../database/discordDatabase').client;
const { EmbedBuilder } = require('discord.js');
const { riotMatchV5 } = require('../api/apiRiotAccounts');
const { riotMatchData } = require('../api/apiRiotAccounts');

async function handleListRank(client, channelId) {
    const db = dbConnection.db();
    const invocadoresColletion = db.collection('invocadores');

    try {
        const invocadores = await invocadoresColletion.find({}).toArray();
        const totalInvocadores = invocadores.length;
        let invocadoresAtualizados = 0;

        for (const invocador of invocadores) {
            const jogadorPuuid = invocador.puuid;

            try {
                const matches = await riotMatchV5(jogadorPuuid, 15);
                const jsonResultado = await riotMatchData(matches);

                if (Array.isArray(jsonResultado)) {
                    const participante = jsonResultado.flatMap(partida => partida.info.participants)
                                                     .find(participante => participante.puuid === jogadorPuuid);

                    if (participante) {
                        let somaKDA = 0;
                        jsonResultado.forEach(partida => {
                            const participante = partida.info.participants.find(part => part.puuid === jogadorPuuid);
                            if (participante && participante.challenges && participante.challenges.kda) {
                                somaKDA += participante.challenges.kda;
                            }
                        });

                        const resultKda = somaKDA / jsonResultado.length;

                        const filter = { puuid: jogadorPuuid };
                        const updateDoc = {
                            $set: {
                                KDA: resultKda
                            }
                        };

                        await invocadoresColletion.updateOne(filter, updateDoc, { upsert: true });
                        invocadoresAtualizados++;
                    } else {
                        console.log(`Invocador com PUUID ${jogadorPuuid} não encontrado.`);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar partidas:', error);
            }
        }

        const topPlayers = await invocadoresColletion.find().sort({ KDA: -1 }).limit(10).toArray();

        let rankingMessage = "";
        topPlayers.forEach((player, index) => {
            rankingMessage += `${index + 1}. ${player.gameName}#${player.tagLine} - KDA: ${player.KDA.toFixed(2)}\n`;
        });

        //console.log("resultado da buceta", rankingMessage)

        const channel = await client.channels.cache.find(ch => ch.id === channelId.id);

        if (channel && channel.name === "ranking") {
           
            //await channel.send(rankingMessage);

            const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            //.setTitle('Ranking TOP 1-10')
            //.setURL('https://as2.ftcdn.net/v2/jpg/05/23/72/65/1000_F_523726593_TCQv7myUcw6JxrhurLbFcgzjyfq7EZMz.jpg')
            .setAuthor({ name: 'Game House', iconURL: 'https://pbs.twimg.com/profile_images/1799445211254263808/SxKMnFhB_400x400.jpg', url: 'https://x.com/GameeeHousee' })
            .setDescription('📌 League of legends')
            .setThumbnail('https://as2.ftcdn.net/v2/jpg/05/23/72/65/1000_F_523726593_TCQv7myUcw6JxrhurLbFcgzjyfq7EZMz.jpg')
            .addFields(
                { name: '🏆 Ranking Top 10', value: '\u200B' },
                { name: 'N° \u200B', value: '🥇 \n🥈 \n🥉\n 4°\n 5°', inline: true},
                { name: 'Players \u200B', value: 'Crackudinho \nThalissu \nzodd50 \n Franciscano1 \n ReiDelas', inline: true},
                { name: 'KDA \u200B', value: '3.22\n3.14\n1.29\n1.17\n1.05', inline: true }
            )
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Atualizado:', iconURL: 'https://pbs.twimg.com/profile_images/1799445211254263808/SxKMnFhB_400x400.jpg' });

            channel.send({ embeds: [exampleEmbed] });
        } else {
            console.error('Canal "Ranking" não é um canal de texto ou não encontrado.');
        }

        console.log(`Atualizados ${invocadoresAtualizados} de ${totalInvocadores} invocadores.`);
        return;
    } catch (error) {
        console.error('Erro ao listar ranking:', error);
    }
}

module.exports = { handleListRank };
