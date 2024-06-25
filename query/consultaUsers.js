const dbConnection = require('../database/discordDatabase').client;

async function isuserResult(userDiscord, userServerDiscordID, serverName) {
  try {
    const db = dbConnection.db();
    const userServersCollection = db.collection('user_servers');
    const serversCollection = db.collection('servers');
    const userCollection = db.collection('users');

    const resultusers = await userCollection.findOne({ discordUserID: userDiscord });
    const userResult = await userServersCollection.findOne({ userId: userDiscord });
    const serverResult = await serversCollection.findOne({ discordServerID: userServerDiscordID });

    const result = {
      resultusers,
      userResult,
      serverResult
    };

    if (userResult && !serverResult || resultusers && !serverResult && !userResult) {
      try {
        await serversCollection.insertOne({
          discordServerID: userServerDiscordID,
          serverName: serverName
        });

        await userServersCollection.insertOne({
          userId: userDiscord,
          serverId: userServerDiscordID,
          credits: 5
        });

        return { success: true, message: "Servidor e relação usuário-servidor registrados com sucesso." };
      } catch (error) {
        console.error('Erro ao registrar servidor e relação usuário-servidor no Banco De Dados:', error);
        return { success: false, message: "Erro ao registrar servidor e relação usuário-servidor no Banco De Dados." };
      }
    }

    if (userResult && serverResult) {
      //console.log('Usuário e Servidor encontrados no Banco De Dados:', userDiscord, userServerDiscordID);
      return result;
    }


  } catch (error) {
    console.error("Erro ao consultar usuário e servidor no Banco De Dados:", error);
    return { userResult: false, serverResult: false };
  }
}

module.exports = isuserResult;
