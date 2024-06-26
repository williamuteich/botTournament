const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const { RIOT_TOKEN } = process.env;

async function fetchRiotAccount(gameName, tagLine){
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_TOKEN}`;

    try {
        const response = await axios.get(url,{
            headers : {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,gl;q=0.6",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com"
            }
        });
        
        return response.data;

    } catch (error) {
        console.error("Erro ao fazer requisição para API Riot Games.")
        throw error;
    }
}

module.exports = fetchRiotAccount;
