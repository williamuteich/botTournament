const salvarRegistros = require('../query/saveUsers');
const updateRegistros = require('../query/updateUsers');

async function handleModalRegister(interaction, mappedResponses) {
    const userDiscordId = interaction.user.id;
    const serverDiscordId = interaction.guild.id;
    const serverName = interaction.guild.name;

    const result = await salvarRegistros({
        userDiscordId,
        serverDiscordId,
        serverName,
        nome: mappedResponses[0],
        sobrenome: mappedResponses[1],
        email: mappedResponses[2],
        cpf: mappedResponses[3],
    });

    if (result.success) {
        await interaction.reply("Obrigado por se registrar!");
    } else {
        await interaction.reply("Ocorreu um erro ao salvar o usuário. Por favor, tente novamente mais tarde.");
    }
}

async function handleModalUpdate(interaction, mappedResponses) {
    const userDiscordId = interaction.user.id;

    const result = await updateRegistros({
        userDiscordId,
        nome: mappedResponses[0],
        sobrenome: mappedResponses[1],
        email: mappedResponses[2],
        cpf: mappedResponses[3],
    });

    if (result.success) {
        await interaction.reply({ content: 'Dados Atualizados com Sucesso!', ephemeral: true });
    } else {
        await interaction.reply({ content: result.message || 'Erro ao registrar os dados.', ephemeral: true });
    }
}

module.exports = {
    handleModalRegister,
    handleModalUpdate
};
