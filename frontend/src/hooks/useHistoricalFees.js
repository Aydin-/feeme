import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export const useHistoricalFees = () => {
  const [historicalFees, setHistoricalFees] = useState({
    data: [],
    loading: true,
    error: null
  });

  const fetchHistoricalFees = async () => {
    try {
      setHistoricalFees(prev => ({ ...prev, loading: true, error: null }));
      const response = await axios.get(`${API_BASE_URL}/v1/fees/historical`);
      
      setHistoricalFees({
        data: response.data,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Failed to fetch historical fees:', err);
      setHistoricalFees(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load historical fee data'
      }));
    }
  };

  useEffect(() => {
    fetchHistoricalFees();
    // Update every 10 minutes
    const timer = setInterval(fetchHistoricalFees, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return historicalFees;
}; 