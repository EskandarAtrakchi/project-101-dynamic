const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const fetch = require('node-fetch'); // This line will work with node-fetch@2.x
const app = express();

const port = process.env.PORT || 3010;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'tested! working.' });
    console.log(res.json());
});

app.get('/wallet-generate.html', (req, res) => {
    try {
        const seedPhrase = bip39.generateMnemonic();
        res.json({ seedPhrase });
    } catch (error) {
        console.error('Error fetching data from backend:', error.message);
        res.status(500).json({ error: 'Error fetching data from backend' });
    }
});

app.get('/charts.html', async (req, res) => {
    try {
        const response = await axios.get('https://api.alternative.me/v1/ticker/');
        const responseData = response.data;
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data from external API:', error.message);
        res.status(500).json({ error: 'Error fetching data from external API' });
    }
});

app.get('/portfolio.html/:address', async (req, res) => {
    const address = req.params.address;
    const response = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth&exclude_spam=true&exclude_unverified_contracts=true`, 
    {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env['X-API-Key'] // Use the environment variable
        },
    });
    const data = await response.json();
    res.send(data);
});

app.post('/net-worth.html', async (req, res) => {
    const { walletAddress, chain } = req.body;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-Key': process.env['X-API-Key']
        },
    };
    try {
        const response = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?chains%5B0%5D=${chain}&exclude_spam=true&exclude_unverified_contracts=true`, options);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching data from external API:', err.message);
        res.status(500).json({ error: 'Error fetching data from external API' });
    }
});

// API endpoints
app.get('/coins', async (req, res) => {
    try {
        const response = await fetch('https://bitcoinexplorer.org/api/blockchain/coins');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching coin data:', error);
        res.status(500).json({ error: 'An error occurred while fetching coin data' });
    }
});

app.get('/next-halving', async (req, res) => {
    try {
        const response = await fetch('https://bitcoinexplorer.org/api/blockchain/next-halving');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching next halving data:', error);
        res.status(500).json({ error: 'An error occurred while fetching next halving data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});