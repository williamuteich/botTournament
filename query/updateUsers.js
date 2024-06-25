const dbConnection = require('../database/discordDatabase').client;

async function updateRegistros(data) {
    try {
        const db = dbConnection.db();
        const userCollection = db.collection('users');
        const existingUser = await userCollection.findOne({ userDiscord: data.userDiscordId });
        
        if (!data.userDiscordId) {
            throw new Error('userDiscordId não está definido');
        }

        if (!existingUser) {
            return { success: false, message: 'Usuário não encontrado para atualização.' };
        }

        await userCollection.updateOne(
            { userDiscord: data.userDiscordId },
            {
                $set: {
                    nome: data.nome,
                    sobrenome: data.sobrenome,
                    email: data.email,
                    cpf: data.cpf,
                    updatedAt: new Date()
                }
            }
        );
    
        return { success: true, message: 'Dados do Usuário Atualizados com Sucesso.' };
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        return { success: false, message: 'Erro ao atualizar dados do usuário.' };
    }
}

module.exports = updateRegistros;
