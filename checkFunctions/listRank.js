const dbConnection = require('../database/discordDatabase').client;
const { riotMatchV5 } = require('../api/apiRiotAccounts');
const { riotMatchData } = require('../api/apiRiotAccounts');


async function handleListRank(client) {

    const db = dbConnection.db();
    const invocadoresColletion = db.collection('invocadores');

    try {
        const invocadores = await invocadoresColletion.find({}).toArray();
        const totalInvocadores = invocadores.length;
        let invocadoresAtualizados = 0;

        for (const invocador of invocadores) {
            const jogadorPuuid = invocador.puuid;

            try {
                const matches = await riotMatchV5(jogadorPuuid, 3);
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

                        const result = await invocadoresColletion.updateOne(filter, updateDoc, { upsert: true });
                        console.log(`Documento atualizado para jogador com PUUID ${jogadorPuuid}`);
                        invocadoresAtualizados++;
                    } else {
                        console.log(`Invocador com PUUID ${jogadorPuuid} não encontrado.`);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar partidas:', error);
            }
        }

        console.log(`Atualizados ${invocadoresAtualizados} de ${totalInvocadores} invocadores.`);
        return;
    } catch (error) {
        console.error('Erro ao listar ranking:', error);
    }
}

module.exports = { handleListRank };
