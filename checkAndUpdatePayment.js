const { Payment, MercadoPagoConfig } = require('mercadopago');
const dbConnection = require('./database/discordDatabase').client;
const dotenv = require('dotenv');

dotenv.config();

const { TOKEN_MERCADOPAGO } = process.env;

const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000 } });
const payment = new Payment(clientMercadoPago);

async function pollPayments(client) {
    console.log("Verificando pagamentos pendentes...");
    const db = dbConnection.db(); 
    const paymentsCollection = db.collection('gatewayPayments');
    const usersCollection = db.collection('user_servers');

    try {
        const pendingPayments = await paymentsCollection.find({
            status: 'pending'
        }).toArray();

        for (const paymentRecord of pendingPayments) {
            const { paymentId, userDiscordId, serverId } = paymentRecord;

            const response = await payment.get({ id: paymentId });

            if (response.api_response.status === 200) {
                const status = response.status;
                
                if (status !== 'pending') {
                    await paymentsCollection.updateOne(
                        { paymentId },
                        { $set: { status: status === 'approved' ? 'aprovado' : status } }
                    );

                    if (status === 'approved') {
                        await usersCollection.updateOne(
                            { userId: userDiscordId, serverId: serverId },
                            { $inc: { credits: 10 } } 
                        );
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro ao verificar pagamentos pendentes:', error);
    }
}

module.exports = { pollPayments };