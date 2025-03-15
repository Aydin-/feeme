import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const priceCache = new Map();

export const usePriceHistory = (timespan = '1y') => {
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
        
        // Fetch data from our backend
        const response = await axios.get(`${API_BASE_URL}/v1/price/historical/${timespan}`);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received');
        }

        // Process the data points
        const data = response.data;
        const timestamps = data.map(item => item.timestamp);
        const prices = data.map(item => item.price);

        // Ensure we have valid data
        if (timestamps.length === 0 || prices.length === 0) {
          throw new Error('No valid price data received');
        }

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