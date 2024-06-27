const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const { RIOT_TOKEN } = process.env;

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,gl;q=0.6",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com"
};

async function fetchRiotAccount(gameName, tagLine){
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_TOKEN}`;

    try {
        const response = await axios.get(url, { headers});
        return response.data;

    } catch (error) {
        console.error("Erro ao fazer requisição para API Riot Games - ACCOUNT-V1.")
        throw error;
    }
}

async function riotMatchV5(puuid) {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${RIOT_TOKEN}`
    
    try {
        const response = await axios.get(url, { headers})
        return response.data;

    } catch (error) {
        console.error("Erro ao fazer requisição para API Riot Games - MATCH-V5(PUUID/IDS).")
        throw error;
    }
}

async function riotMatchData(data) {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${data}?api_key=${RIOT_TOKEN}`;

    try {
        const response = await axios.get(url, { headers})
        return response.data;

    } catch (error) {
        console.error(`Erro ao buscar dados da partida ${match}:`, error);
        throw error;
    }
}

module.exports = {
    fetchRiotAccount,
    riotMatchV5,
    riotMatchData
};
