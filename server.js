const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MEMPOOL_API = 'https://mempool.space/api';

// Cache for historical fees data
let historicalFeesCache = {
  data: null,
  lastUpdated: null
};

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// Endpoint to get historical fees
app.get('/api/v1/fees/historical', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (historicalFeesCache.data && historicalFeesCache.lastUpdated && 
        (now - historicalFeesCache.lastUpdated) < CACHE_DURATION) {
      return res.json(historicalFeesCache.data);
    }

    // Fetch new data from mempool.space
    const response = await axios.get(`${MEMPOOL_API}/v1/fees/mempool-blocks`);
    
    // Process and structure the data
    const processedData = response.data.map(block => ({
      timestamp: block.timestamp,
      medianFee: block.medianFee,
      minFee: block.minFee,
      maxFee: block.maxFee,
      feeRange: block.feeRange,
    }));

    // Update cache
    historicalFeesCache = {
      data: processedData,
      lastUpdated: now
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error fetching historical fees:', error);
    res.status(500).json({ error: 'Failed to fetch historical fees data' });
  }
});

// Endpoint to get current network fees
app.get('/api/fees', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/v1/fees/recommended`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Failed to fetch fee data' });
  }
});

// Endpoint to get mempool stats
app.get('/api/mempool', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/mempool`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching mempool data:', error);
    res.status(500).json({ error: 'Failed to fetch mempool data' });
  }
});

// Endpoint to get latest block height
app.get('/api/v1/blocks/tip/height', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/v1/blocks/tip/height`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching block height:', error);
    res.status(500).json({ error: 'Failed to fetch block height' });
  }
});

// Endpoint to get difficulty adjustment info
app.get('/api/v1/difficulty-adjustment', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/v1/difficulty-adjustment`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching difficulty adjustment:', error);
    res.status(500).json({ error: 'Failed to fetch difficulty adjustment data' });
  }
});

// Endpoint to get hashrate history
app.get('/api/v1/mining/hashrate/:timespan', async (req, res) => {
  try {
    const { timespan } = req.params;
    const response = await axios.get(`${MEMPOOL_API}/v1/mining/hashrate/${timespan}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hashrate history:', error);
    res.status(500).json({ error: 'Failed to fetch hashrate history' });
  }
});

// Endpoint to get recent blocks
app.get('/api/v1/blocks', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/v1/blocks`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks data' });
  }
});

// Endpoint to get recent transactions
app.get('/api/mempool/recent', async (req, res) => {
  try {
    const response = await axios.get(`${MEMPOOL_API}/mempool/recent`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
});

// Endpoint to calculate fee for a specific transaction size
app.post('/api/calculate-fee', async (req, res) => {
  try {
    const { size } = req.body;
    if (!size) {
      return res.status(400).json({ error: 'Transaction size is required' });
    }

    const feesResponse = await axios.get(`${MEMPOOL_API}/v1/fees/recommended`);
    const { fastestFee, halfHourFee, hourFee } = feesResponse.data;

    // Correct conversion: 1 BTC = 100,000,000 satoshis
    // size * fee rate (sats/vB) = total satoshis
    // total satoshis / 100,000,000 = BTC
    const fees = {
      fast: ((size * fastestFee) / 100000000).toFixed(8),
      medium: ((size * halfHourFee) / 100000000).toFixed(8),
      slow: ((size * hourFee) / 100000000).toFixed(8)
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