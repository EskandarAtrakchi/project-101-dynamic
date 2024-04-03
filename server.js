const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const app = express();
const port = process.env.PORT || 3010;

app.use(express.json());
app.use(cors());

app.get('/calculate.html', (req, res) => {
    // Generate the seed phrase
    const seedPhrase = bip39.generateMnemonic();
    // Send the seed phrase as JSON response
    res.json({ seedPhrase });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
