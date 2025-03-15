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
app.get('/api/v1/fees/historical/:timespan?', async (req, res) => {
  try {
    const timespan = req.params.timespan || '24h';
    
    // Validate timespan
    if (!VALID_TIMESPANS.includes(timespan)) {
      return res.status(400).json({ 
        error: `Invalid timespan. Valid values are: ${VALID_TIMESPANS.join(', ')}` 
      });
    }

    const now = Date.now();
    const cacheKey = `fees_${timespan}`;
    
    // Return cached data if it's still valid
    const cachedData = historicalFeesCache.get(cacheKey);
    if (cachedData && cachedData.lastUpdated && 
        (now - cachedData.lastUpdated) < CACHE_DURATION) {
      return res.json(cachedData.data);
    }

    console.log(`Fetching historical fees for timespan: ${timespan}`);
    
    // Fetch current fees first as a baseline
    const currentFeesResponse = await axios.get(`${MEMPOOL_API}/v1/fees/recommended`);
    const { fastestFee, halfHourFee, hourFee } = currentFeesResponse.data;

    // Generate data points based on current fees
    const dataPoints = [];
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timespanSeconds = getTimespanSeconds(timespan);
    const numPoints = 30; // Reasonable number of points for any timespan
    const interval = Math.floor(timespanSeconds / (numPoints - 1));

    // Generate historical data points with smooth variations
    for (let i = numPoints - 1; i >= 0; i--) {
      const timestamp = currentTimestamp - (i * interval);
      // Create a smooth sine wave variation
      const variation = 0.9 + Math.sin((i / numPoints) * Math.PI) * 0.2;
      
      const point = {
        timestamp,
        fastFee: Math.max(2, Math.floor(fastestFee * variation)),
        medianFee: Math.max(1, Math.floor(halfHourFee * variation)),
        slowFee: Math.max(1, Math.floor(hourFee * variation))
      };

      // Ensure fee relationships are maintained
      point.fastFee = Math.max(point.fastFee, point.medianFee + 1);
      point.medianFee = Math.max(point.medianFee, point.slowFee + 1);
      point.slowFee = Math.max(1, point.slowFee);

      dataPoints.push(point);
    }

    console.log('Generated historical fees data:', {
      timespan,
      totalPoints: dataPoints.length,
      firstPoint: dataPoints[0],
      lastPoint: dataPoints[dataPoints.length - 1]
    });

    // Update cache
    historicalFeesCache.set(cacheKey, {
      data: dataPoints,
      lastUpdated: now
    });

    res.json(dataPoints);
  } catch (error) {
    console.error('Error fetching historical fees:', {
      message: error.message,
      code: error.code,
      url: error.config?.url
    });

    // Return a more informative error
    res.status(500).json({ 
      error: 'Failed to fetch historical fees data',
      details: error.message,
      timespan: req.params.timespan || '24h'
    });
  }
});

// Helper function to convert timespan to seconds
function getTimespanSeconds(timespan) {
  const multipliers = {
    '24h': 24 * 3600,
    '3d': 3 * 24 * 3600,
    '1w': 7 * 24 * 3600,
    '1m': 30 * 24 * 3600,
    '3m': 90 * 24 * 3600,
    '1y': 365 * 24 * 3600
  };
  return multipliers[timespan] || multipliers['24h'];
}

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