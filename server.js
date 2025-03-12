const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to get current network fees
app.get('/api/fees', async (req, res) => {
  try {
    const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Failed to fetch fee data' });
  }
});

// Endpoint to get mempool stats
app.get('/api/mempool', async (req, res) => {
  try {
    const response = await axios.get('https://mempool.space/api/v1/mempool');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching mempool data:', error);
    res.status(500).json({ error: 'Failed to fetch mempool data' });
  }
});

// Endpoint to calculate fee for a specific transaction size
app.post('/api/calculate-fee', async (req, res) => {
  try {
    const { size } = req.body;
    if (!size) {
      return res.status(400).json({ error: 'Transaction size is required' });
    }

    const feesResponse = await axios.get('https://mempool.space/api/v1/fees/recommended');
    const { fastestFee, halfHourFee, hourFee } = feesResponse.data;

    const fees = {
      fast: Math.ceil((size * fastestFee) / 1000), // Convert to BTC
      medium: Math.ceil((size * halfHourFee) / 1000),
      slow: Math.ceil((size * hourFee) / 1000)
    };

    res.json(fees);
  } catch (error) {
    console.error('Error calculating fees:', error);
    res.status(500).json({ error: 'Failed to calculate fees' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 