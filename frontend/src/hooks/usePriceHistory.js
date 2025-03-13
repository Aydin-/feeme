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
          '365d': 365,
          '1825d': 1825
        }[timespan];

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

        const newData = {
          timestamps,
          prices,
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