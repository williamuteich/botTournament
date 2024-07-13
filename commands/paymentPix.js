const { v4: uuidv4 } = require('uuid');
const dbConnection = require('../database/discordDatabase').client;
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { format, addMinutes } = require('date-fns');
const dotenv = require('dotenv');

dotenv.config();
const { TOKEN_MERCADOPAGO, TOKEN_CHAVEPIX } = process.env;

const { Payment, MercadoPagoConfig } = require('mercadopago');
const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000 } });
const payment = new Payment(clientMercadoPago);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pix')
        .setDescription('Realiza um pagamento via Pix.'),
    
    async execute(interaction) {
        try {
            const userDiscordID = interaction.user.id;
            const serverId = interaction.guild.id;
            const db = dbConnection.db();
            const usersCollection = db.collection('users');
            const paymentsCollection = db.collection('gatewayPayments');

            const user = await usersCollection.findOne({ userDiscord: userDiscordID });
            console.log(user)
            const idempotencyKey = uuidv4();

           const createdAtFormatted = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: 'America/Sao_Paulo' });
           const dateExpiration = format(addMinutes(new Date(createdAtFormatted), 6), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: 'America/Sao_Paulo' });

            const paymentData = {
                transaction_amount: 1.00,
                description: 'Bot Tournament - Generative AI Art',
                date_of_expiration: dateExpiration,
                payment_method_id: 'pix',
                token: TOKEN_CHAVEPIX,
                payer: {
                    email: user.email,
                    first_name: user.name,
                    last_name: user.last_name,
                    identification: {
                        type: 'CPF',
                        number: user.cpf,
                    }
                }
            };

            const result = await payment.create({
                body: paymentData,
                requestOptions: { idempotencyKey }
            });

            const paymentRecord = {
                status: 'pending',
                paymentId: result.id,
                transactionAmount: paymentData.transaction_amount,
                qrCode: result.point_of_interaction.transaction_data.qr_code,
                qrCode64: result.point_of_interaction.transaction_data.qr_code_base64,
                copyPasteCode: result.point_of_interaction.transaction_data.ticket_url,
                userDiscordId: userDiscordID,
                serverId: serverId,
                idempotencyKey, 
                createdAt: createdAtFormatted
            };

            await paymentsCollection.insertOne(paymentRecord);
            const imagemBase64 = `data:image/gif;base64,${result.point_of_interaction.transaction_data.qr_code_base64}`;

            const imageBuffer = Buffer.from(imagemBase64.split(",")[1], 'base64');
            const attachments = new AttachmentBuilder(imageBuffer, 'qrCode.png');
            
            await interaction.reply({
                content: `**Copia e Cola:**\n\`\`\`${result.point_of_interaction.transaction_data.qr_code}\n\`\`\``,
                files: [attachments],
                ephemeral: true,
                components: [],
            });
            
            await interaction.followUp({
                content: "Link para pagamento: " + result.point_of_interaction.transaction_data.ticket_url,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Erro ao executar o pagamento:", error);
            await interaction.reply("Erro ao executar o pagamento: " + error.message);
        }
    }
};