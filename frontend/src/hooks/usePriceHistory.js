import { useState, useEffect } from 'react';
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const priceCache = new Map();

export const usePriceHistory = (timespan = '3y') => {
  const [priceData, setPriceData] = useState({
    timestamps: [],
    prices: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // Check cache first
        const cacheKey = `price_${timespan}`;
        const cachedData = priceCache.get(cacheKey);
        
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setPriceData({
            ...cachedData.data,
            loading: false,
            error: null
          });
          return;
        }

        setPriceData(prev => ({ ...prev, loading: true, error: null }));
        
        // Convert timespan to CoinGecko's format
        const days = {
          '1w': 7,
          '1m': 30,
          '3m': 90,
          '1y': 365,
          '3y': 1095,
          'all': 'max'
        }[timespan];

        if (!days) {
          throw new Error('Invalid timespan');
        }

        // Make a single API call with the appropriate days parameter
        const response = await axios.get(
          `${COINGECKO_API_URL}/coins/bitcoin/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days,
              interval: timespan === '1w' ? 'hourly' : 'daily',
              precision: 2
            },
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.data || !response.data.prices || !Array.isArray(response.data.prices)) {
          throw new Error('Invalid data format received');
        }

        const data = response.data.prices;
        const timestamps = data.map(([timestamp]) => new Date(timestamp));
        const prices = data.map(([, price]) => price);

        // Sample data for longer periods to maintain reasonable number of points
        let sampledTimestamps, sampledPrices;
        
        if (timespan === '1w') {
          // For 1 week, show 4-hour intervals (42 points)
          const step = Math.max(1, Math.floor(prices.length / 42));
          sampledTimestamps = timestamps.filter((_, i) => i % step === 0);
          sampledPrices = prices.filter((_, i) => i % step === 0);
        } else if (timespan === 'all') {
          // For all time, show weekly data points
          const step = Math.max(1, Math.floor(prices.length / 200));
          sampledTimestamps = timestamps.filter((_, i) => i % step === 0);
          sampledPrices = prices.filter((_, i) => i % step === 0);
        } else {
          // For other periods, use daily data points but limit to ~200 points
          const step = Math.max(1, Math.floor(prices.length / 200));
          sampledTimestamps = timestamps.filter((_, i) => i % step === 0);
          sampledPrices = prices.filter((_, i) => i % step === 0);
        }

        const newData = {
          timestamps: sampledTimestamps,
          prices: sampledPrices,
          loading: false,
          error: null
        };

        // Update cache
        priceCache.set(cacheKey, {
          data: newData,
          timestamp: Date.now()
        });

        setPriceData(newData);
      } catch (err) {
        console.error('Price history fetch error:', err);
        
        // If we have cached data that's expired, use it as fallback
        const cacheKey = `price_${timespan}`;
        const cachedData = priceCache.get(cacheKey);
        
        if (cachedData) {
          setPriceData({
            ...cachedData.data,
            loading: false,
            error: 'Using cached data - ' + (err.response?.data?.error || err.message || 'Failed to fetch fresh data')
          });
        } else {
          setPriceData(prev => ({
            ...prev,
            loading: false,
            error: err.response?.data?.error || err.message || 'Failed to fetch price data'
          }));
        }
      }
    };

    fetchPriceHistory();
  }, [timespan]);

  return priceData;
}; 