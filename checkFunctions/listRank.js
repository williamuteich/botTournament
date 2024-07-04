const dbConnection = require('../database/discordDatabase').client;
const { riotMatchV5, riotMatchData } = require('../api/apiRiotAccounts');

async function handleListRank(client) {
    const db = dbConnection.db();
    const invocadoresColletion = db.collection('invocadores');

    try {
        const count = await invocadoresColletion.countDocuments();
        console.log(`Total de invocadores: ${count}`);
        const invocadores = await invocadoresColletion.find({}).toArray();

        if (invocadores) { 
            const groupedInvocadores = [];
            for (let i = 0; i < invocadores.length; i += 3) {
                groupedInvocadores.push(invocadores.slice(i, i + 3));
            }

            for (let groupIndex = 0; groupIndex < groupedInvocadores.length; groupIndex++) {
                const grupo = groupedInvocadores[groupIndex];
                const promises = [];

                grupo.forEach(invocador => {
                    const jogadorPuuid = invocador.puuid;
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const matches = await riotMatchV5(jogadorPuuid, 15);
                            const jsonResultado = await riotMatchData(matches);
                    
                            if (Array.isArray(jsonResultado)) {
                                const invocadorEncontrado = jsonResultado.flatMap(partida => partida.info.participants)
                                                                  .find(participante => participante.puuid === jogadorPuuid);
                                if (invocadorEncontrado) {
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
                                } else {
                                    console.log(`Invocador com PUUID ${jogadorPuuid} não encontrado.`);
                                }
                            }

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });

                    promises.push(promise);
                });

                await Promise.all(promises);

                if (groupIndex < groupedInvocadores.length - 1) {
                    console.log(`Aguardando 2 minutos antes do próximo grupo de requisições...`);
                    await new Promise(resolve => setTimeout(resolve, 120000)); 
                }
            }
        }

        return invocadores;
    } catch (error) {
        console.error('Erro ao listar ranking:', error);
    }
}

module.exports = { handleListRank };
