const dbConnection = require('../database/discordDatabase').client;

async function checkInvocador(userId) {
    try {
        const db = dbConnection.db();
        const invocadoresCollection = db.collection('invocadores');
        const resultInvocador = await invocadoresCollection.findOne({ userDiscord: userId });

        if (resultInvocador) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao verificar invocador no Banco De Dados:", error);
        return false;
    }
}

module.exports = checkInvocador;
