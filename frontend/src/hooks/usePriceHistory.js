import { useState, useEffect } from 'react';
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const priceCache = new Map();

export const usePriceHistory = (timespan = '365d') => {
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
          '1d': 1,
          '7d': 7,
          '30d': 30,
          '90d': 90,
          '365d': 365
        }[timespan];

        // Make a single API call with the appropriate days parameter
        const response = await axios.get(
          `${COINGECKO_API_URL}/coins/bitcoin/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: days,
              interval: 'daily',
              precision: 2
            },
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.data || !response.data.prices) {
          throw new Error('Invalid data format received');
        }

        const data = response.data.prices;
        const timestamps = data.map(([timestamp]) => new Date(timestamp));
        const prices = data.map(([, price]) => price);

        // Sample data based on timespan to maintain reasonable number of points
        let sampledTimestamps, sampledPrices;
        
        if (timespan === '1d') {
          // 24 points for 24h (1 per hour)
          const step = Math.max(1, Math.floor(prices.length / 24));
          sampledTimestamps = timestamps.filter((_, i) => i % step === 0);
          sampledPrices = prices.filter((_, i) => i % step === 0);
        } else if (timespan === '7d') {
          // 84 points for 7 days (12 per day)
          const step = Math.max(1, Math.floor(prices.length / 84));
          sampledTimestamps = timestamps.filter((_, i) => i % step === 0);
          sampledPrices = prices.filter((_, i) => i % step === 0);
        } else {
          // For longer periods, use daily data points
          sampledTimestamps = timestamps;
          sampledPrices = prices;
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