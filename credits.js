const { client } = require('./database/discordDatabase');

async function getUserCredits(userId, serverId) {
    try {
        const db = client.db();
        const userServersCollection = db.collection('user_servers');
        const userServer = await userServersCollection.findOne({ userId, serverId });
        return userServer ? userServer.credits : null;
    } catch (error) {
        console.error('Erro ao obter créditos do usuário:', error);
        return null;
    }
}

async function updateUserCredits(userId, serverId, credits) {
    try {
        const db = client.db();
        const userServersCollection = db.collection('user_servers');
        const result = await userServersCollection.updateOne(
            { userId, serverId },
            { $set: { credits } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Erro ao atualizar créditos do usuário:', error);
        return false;
    }
}

module.exports = { getUserCredits, updateUserCredits };