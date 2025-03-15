import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export const useHistoricalFees = (timespan = '24h') => {
  const [historicalFees, setHistoricalFees] = useState({
    data: [],
    loading: true,
    error: null
  });

  const fetchHistoricalFees = useCallback(async () => {
    try {
      setHistoricalFees(prev => ({ ...prev, loading: true, error: null }));
      
      // Clear existing data when fetching new timespan
      setHistoricalFees({
        data: [],
        loading: true,
        error: null
      });

      console.log(`Fetching historical fees for timespan: ${timespan}`);
      const response = await axios.get(`${API_BASE_URL}/v1/fees/historical/${timespan}`);
      console.log('Received response:', response.data);
      
      // Validate and process the response data
      if (Array.isArray(response.data)) {
        const processedData = response.data.map(item => ({
          timestamp: item.timestamp,
          fastFee: Number(item.fastFee),
          medianFee: Number(item.medianFee),
          slowFee: Number(item.slowFee)
        }));

        console.log('Processed data:', processedData);
        setHistoricalFees({
          data: processedData,
          loading: false,
          error: null
        });
      } else {
        console.error('Invalid data format:', response.data);
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Failed to fetch historical fees:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setHistoricalFees(prev => ({
        ...prev,
        data: [],
        loading: false,
        error: 'Failed to load historical fee data'
      }));
    }
  }, [timespan]); // Add timespan as dependency

  useEffect(() => {
    // Fetch immediately when timespan changes
    fetchHistoricalFees();

    // Set up interval for periodic updates
    const timer = setInterval(fetchHistoricalFees, 10 * 60 * 1000);
    
    // Cleanup interval on unmount or timespan change
    return () => clearInterval(timer);
  }, [timespan, fetchHistoricalFees]);

  return historicalFees;
}; 