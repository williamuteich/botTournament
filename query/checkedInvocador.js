const dbConnection = require('../database/discordDatabase').client;

async function checkInvocador(userDiscordId) {
    try {
        const db = dbConnection.db();
        const invocadoresCollection = db.collection('invocadores');
        const resultInvocador = await invocadoresCollection.findOne({ userDiscord: userDiscordId });
        return resultInvocador ? true : false;
        
    } catch (error) {
        console.error("Erro ao verificar invocador no Banco De Dados:", error);
        return false;
    }
}

module.exports = checkInvocador;
