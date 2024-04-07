const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const app = express();

const port = process.env.PORT || 3010;

app.use(express.json());
app.use(cors());
 
//route number one index 
app.get('/', (req, res) => {
    //just to see if the server is running
    res.json({ message: 'tested! working.' });
    console.log(res.json());
});

app.get('/wallet-generate.html', (req, res) => {

    // Generate the seed phrase
    const seedPhrase = bip39.generateMnemonic();
    // Send the seed phrase as JSON response
    res.json({ seedPhrase });

});

// route number two ticker 
app.get('/charts.html', async (req, res) => {
    try {
        //wait for axios to get the API response 
        const response = await axios.get('https://api.alternative.me/v1/ticker/');
        const responseData = response.data;

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data from external API:', error.message);
        res.status(500).json({ error: 'Error fetching data from external API' });
    }
});

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);

});
