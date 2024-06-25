const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const { MONGODB_TOKEN } = process.env;

const url =MONGODB_TOKEN;
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Conectou ao banco de dados MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados MongoDB:", error);
  }
}

run().catch(console.dir);

module.exports = { client };
