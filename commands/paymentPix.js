const { v4: uuidv4 } = require('uuid');
const dbConnection = require('../database/discordDatabase').client;
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

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

            const idempotencyKey = uuidv4();

            const createdAtFormatted = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: 'America/Sao_Paulo' });
            const dateExpiration = format(addMinutes(new Date(createdAtFormatted), 6), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: 'America/Sao_Paulo' });

            const paymentData = {
                transaction_amount: 0.10,
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

            const qrCodeBase64 = result.point_of_interaction.transaction_data.qr_code_base64;

            // Montando o embed
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Pagamento Online')
                .setURL(result.point_of_interaction.transaction_data.ticket_url)
                .setAuthor({ name: 'Pagamento Online', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: result.point_of_interaction.transaction_data.ticket_url })
                .setDescription('Faça uma recarga via Pix')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Método', value: 'PIX', inline: true },
                    { name: 'valor', value: 'R$1,00', inline: true },
                    { name: 'Expira', value: '6 Min', inline: true },
                    //{ name: '\u200B', value: '\u200B' },
                    { name: 'Copia e cola', value: `\n\`\`\`${result.point_of_interaction.transaction_data.qr_code}\n\`\`\`` },
                    { name: 'Link de pagamento', value: `[Mercado Pago Payments](${result.point_of_interaction.transaction_data.ticket_url})` },
                )
                .setTimestamp()
                .setFooter({ text: 'Pagamento Gerado', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            await interaction.reply({
                embeds: [exampleEmbed],
                ephemeral: true,
            });

            const imagemBase64 = `data:image/gif;base64,${qrCodeBase64}`;
            const imageBuffer = Buffer.from(imagemBase64.split(",")[1], 'base64');
            const attachments = new AttachmentBuilder(imageBuffer, 'qrCode.png');
            
            await interaction.followUp({
                content: "QR Code: ",
                files: [attachments],
                ephemeral: true,
            });
            
        } catch (error) {
            console.error("Erro ao executar o pagamento:", error);
            await interaction.reply("Erro ao executar o pagamento: " + error.message);
        }
    }
};
