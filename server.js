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
const VALID_TIMESPANS = ['24h', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y'];

// Endpoint to get historical fees with timespan
app.get('/api/v1/fees/historical/:timespan', async (req, res) => {
  try {
    const timespan = req.params.timespan;
    console.log(`Received request for historical fees with timespan: ${timespan}`);
    
    // Validate timespan
    if (!VALID_TIMESPANS.includes(timespan)) {
      console.log(`Invalid timespan received: ${timespan}`);
      return res.status(400).json({ error: 'Invalid timespan' });
    }

    // Check cache first
    const cacheKey = `historical_fees_${timespan}`;
    const cachedData = historicalFeesCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached data for timespan: ${timespan}`);
      return res.json(cachedData.data);
    }

    console.log(`Fetching historical fees from mempool.space API...`);
    
    // Get current recommended fees
    console.log('Fetching current recommended fees...');
    const currentFeesResponse = await axios.get(`${MEMPOOL_API}/v1/fees/recommended`);
    console.log('Current recommended fees response:', JSON.stringify(currentFeesResponse.data, null, 2));
    const currentFees = currentFeesResponse.data;
    
    // Get historical fee data based on timespan
    console.log(`Fetching historical fees data for timespan: ${timespan}`);
    const url = `${MEMPOOL_API}/v1/mining/blocks/fee-rates/${timespan}`;
    console.log('Requesting URL:', url);
    let historicalData;
    try {
      historicalData = await axios.get(url);
      console.log('Historical fees response status:', historicalData.status);
      console.log('Historical fees response headers:', historicalData.headers);
      console.log('Historical fees response:', JSON.stringify(historicalData.data, null, 2));
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }

    if (!historicalData?.data || !Array.isArray(historicalData.data)) {
      console.log('No valid historical fee data received');
      return res.status(500).json({ error: 'No valid fee data available' });
    }

    // Process historical fee data for charting
    const dataPoints = historicalData.data.map(feeData => {
      // Convert timestamp to milliseconds and ensure it's a number
      const timestamp = parseInt(feeData.timestamp) * 1000;
      
      return {
        timestamp,
        height: feeData.avgHeight,
        fastFee: feeData.avgFee_90,     // Maximum fee rate (fastest)
        medianFee: feeData.avgFee_50,  // Median (50th percentile)
        slowFee: feeData.avgFee_0    // Minimum fee rate (slowest)
      };
    });

    // Sort by timestamp in ascending order for charting
    dataPoints.sort((a, b) => a.timestamp - b.timestamp);

    // Ensure we have enough data points for the timespan
    if (dataPoints.length === 0) {
      console.log('No valid data points after processing');
      return res.status(500).json({ error: 'No valid fee data available' });
    }

    // Log the structure of the first few data points
    console.log('Data structure being sent to frontend:');
    console.log('First 3 data points:', JSON.stringify(dataPoints.slice(0, 3), null, 2));
    console.log('Data point structure:', Object.keys(dataPoints[0]));
    console.log('Sample values:', {
      timestamp: dataPoints[0].timestamp,
      fastFee: dataPoints[0].fastFee,
      medianFee: dataPoints[0].medianFee,
      slowFee: dataPoints[0].slowFee
    });

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
      response: error.response?.data,
      stack: error.stack
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