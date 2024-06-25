const dbConnection = require('../database/discordDatabase').client;

async function salvarRegistros(data) {
    const createdAt = new Date();
    const session = dbConnection.startSession();
    session.startTransaction();
    try {
        const db = dbConnection.db();
        const userCollection = db.collection('users');
        const serversCollection = db.collection('servers');
        const userServersCollection = db.collection('user_servers');

        await userCollection.insertOne({
            userDiscord: data.userDiscordId,
            nome: data.nome,
            sobrenome: data.sobrenome,
            email: data.email,
            cpf: data.cpf,
            active: true,
            createdAt,
            updatedAt: createdAt
        }, { session });

        await serversCollection.insertOne(
            { discordServerID: data.serverDiscordId, serverName: data.serverName },
            { session }
        );
        await userServersCollection.insertOne(
            { userId: data.userDiscordId, serverId: data.serverDiscordId, credits: 5 },
            { session }
        );

        await session.commitTransaction();

        return { success: true, message: "Usuário criados com sucesso." };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Erro ao criar usuário, servidor e associação:', error);
        return { success: false, message: "Erro ao criar usuário, servidor e associação." };
    }
}

module.exports = salvarRegistros;
