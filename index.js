const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder  } = require('discord.js');
const salvarRegistros = require('./query/saveUsers');
const isuserResult = require('./query/consultaUsers');
const updateRegistros = require('./query/updateUsers');

const fs = require("node:fs")
const path = require("node:path")

const dotenv = require('dotenv')
dotenv.config()
const { DISCORD_TOKEN} = process.env

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else  {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute ausentes"`)
    } 
}

client.once(Events.ClientReady, c => {
	console.log(`O bot está online como ${c.user.tag}`)
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		try {
			const userDiscord = interaction.user.id;
			const userServerDiscordID = interaction.guild.id;
			const serverName = interaction.guild.name;
			const isRegistered = await isuserResult(userDiscord, userServerDiscordID, serverName);
			
			if (isRegistered && interaction.commandName === 'register') {
				await interaction.reply("Você já está cadastrado.");
				return;
			}

			if (!isRegistered && interaction.commandName !== 'register') {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Registre-se!')
					.setDescription('Cadastre-se para poder utilizar os comandos do bot Tournament!')
					.setThumbnail('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
					.addFields({ name: 'Para se registrar, Digite o comando:', value: '/register', inline: true })
					.setTimestamp();
	
				await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
				return;
			}

			await command.execute(interaction);
		} catch (error) {
			console.error(error)
			await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true })
		}
	}
})

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isModalSubmit()) {
		const values = interaction.components;
		const mappedResponses = Array.isArray(values) ? values.map(response => response.components[0]?.value || '') : [];
		const userDiscordId = interaction.user.id;
		const serverDiscordId = interaction.guild.id;
		const serverName = interaction.guild.name;

        if (mappedResponses[3].length !== 11) {
            await interaction.reply("O CPF deve ter 11 dígitos");
			return;
        }

		if (interaction.customId === 'ModalRegister') {
			const result = await salvarRegistros ({
				userDiscordId,
				serverDiscordId,
				serverName,
				nome: mappedResponses[0],
				sobrenome: mappedResponses[1], 
				email: mappedResponses[2], 
				cpf: mappedResponses[3], 
			});

			if (result.success) {
				await interaction.reply("Obrigado por se registrar!")
			} else {
				await interaction.reply("Ocorreu um erro ao salvar o usuário. Por favor, tente novamente mais tarde.")
			}
		} else if (interaction.customId === 'ModalUpdate') {
			const result = await updateRegistros({
				userDiscordId: userDiscordId,
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
    }
})

client.login(DISCORD_TOKEN)