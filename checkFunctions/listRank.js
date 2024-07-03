const dbConnection = require('../database/discordDatabase').client;
const { riotMatchV5 } = require('../api/apiRiotAccounts')
const { riotMatchData } = require('../api/apiRiotAccounts')

async function handleListRank(client) {
    const db = dbConnection.db();
    const invocadoresColletion = db.collection('invocadores');

    try {
        const count = await invocadoresColletion.countDocuments();

        const invocadores = await invocadoresColletion.find({}).toArray();

        if (invocadores) { 
            invocadores.forEach(async invocador => {
                const jogadorPuuid = invocador.puuid;
        
                try {
                    const matches = await riotMatchV5(jogadorPuuid, 15);
                    const jsonResultado = await riotMatchData(matches);
                    
                    if (Array.isArray(jsonResultado)) {
                        const invocador = jsonResultado.flatMap(partida => partida.info.participants)
                                                       .find(participante => participante.puuid === jogadorPuuid);
                        if (invocador) {
                            let somaKDA = 0;
                            jsonResultado.forEach(partida => {
                                const participante = partida.info.participants.find(part => part.puuid === jogadorPuuid);
                                if (participante && participante.challenges && participante.challenges.kda) {
                                    somaKDA += participante.challenges.kda;
                                }
                            });
                            //vai pegar o kda de todas as partidas e somar e a quantidade de partidas jogadas
                            //para depois fazer uma media de KDA
                            console.log("Soma de todos os KDA:", somaKDA/jsonResultado.length);
                        } else {
                            console.log(`Invocador não encontrado.`);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao buscar partidas:', error);
                }
            });
        }

        return invocadores;
    } catch (error) {
        console.error('Erro ao listar ranking:', error);
    }
}


module.exports = { handleListRank };