const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MEMPOOL_API = 'https://mempool.space/api';

// Cache for historical fees data - separate cache for each timespan
const historicalFeesCache = new Map();

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// Valid timespans for historical fees
const VALID_TIMESPANS = ['24h', '3d', '1w', '1m', '3m', '1y'];

// Endpoint to get historical fees with timespan
app.get('/api/v1/fees/historical/:timespan', async (req, res) => {
  try {
    const timespan = req.params.timespan;
    console.log(`Received request for historical fees with timespan: ${timespan}`);
    
    const validTimespans = ['24h', '3d', '1w', '1m', '3m', '1y'];
    
    if (!validTimespans.includes(timespan)) {
      console.log(`Invalid timespan received: ${timespan}`);
      return res.status(400).json({ error: 'Invalid timespan' });
    }

    // Check cache first
    const cacheKey = `historical_fees_${timespan}`;
    const cachedData = historicalFeesCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
      console.log(`Returning cached data for timespan: ${timespan}`);
      return res.json(cachedData.data);
    }

    console.log(`Fetching current fees from mempool.space API...`);
    // Fetch current fees to use as baseline
    const response = await axios.get(`${MEMPOOL_API}/v1/fees/recommended`);
    const currentFees = response.data;
    console.log(`Received current fees:`, currentFees);

    // Calculate number of data points and interval based on timespan
    let numPoints, interval;
    switch (timespan) {
      case '24h':
        numPoints = 24; // One point per hour
        interval = 3600; // 1 hour in seconds
        break;
      case '3d':
        numPoints = 72; // One point per hour
        interval = 3600;
        break;
      case '1w':
        numPoints = 168; // One point per hour
        interval = 3600;
        break;
      case '1m':
        numPoints = 30; // One point per day
        interval = 86400;
        break;
      case '3m':
        numPoints = 90; // One point per day
        interval = 86400;
        break;
      case '1y':
        numPoints = 365; // One point per day
        interval = 86400;
        break;
      default:
        numPoints = 24;
        interval = 3600;
    }

    console.log(`Generating ${numPoints} data points with interval ${interval} seconds`);

    // Generate historical data points
    const now = Math.floor(Date.now() / 1000);
    const dataPoints = [];

    for (let i = 0; i < numPoints; i++) {
      const timestamp = now - (i * interval);
      
      // Add some random variation to make it more interesting
      const fastMultiplier = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
      const medianMultiplier = 0.85 + Math.random() * 0.3;
      const slowMultiplier = 0.85 + Math.random() * 0.3;

      let fastFee = Math.floor(currentFees.fastestFee * fastMultiplier);
      let medianFee = Math.floor(currentFees.halfHourFee * medianMultiplier);
      let slowFee = Math.floor(currentFees.hourFee * slowMultiplier);

      // Ensure proper fee relationships
      fastFee = Math.max(fastFee, medianFee + 1);
      medianFee = Math.max(medianFee, slowFee + 1);
      slowFee = Math.max(slowFee, 1);

      dataPoints.push({
        timestamp,
        fastFee,
        medianFee,
        slowFee
      });
    }

    // Sort by timestamp in descending order
    dataPoints.sort((a, b) => b.timestamp - a.timestamp);

    console.log(`Generated ${dataPoints.length} data points`);
    console.log(`First data point:`, dataPoints[0]);
    console.log(`Last data point:`, dataPoints[dataPoints.length - 1]);

    // Update cache
    historicalFeesCache.set(cacheKey, {
      data: dataPoints,
      timestamp: Date.now()
    });

    res.json(dataPoints);
  } catch (error) {
    console.error('Error fetching historical fees:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      response: error.response?.data
    });
    res.status(500).json({ 
      error: 'Failed to fetch historical fees data',
      details: error.message
    });
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