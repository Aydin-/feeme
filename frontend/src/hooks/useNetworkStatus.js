import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, UPDATE_INTERVAL } from '../config/constants';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState(null);
  const [error, setError] = useState(null);

  const fetchNetworkStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fees`);
      setNetworkStatus(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch network status');
    }
  };

  useEffect(() => {
    fetchNetworkStatus();
    const timer = setInterval(fetchNetworkStatus, UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return { networkStatus, error };
}; 