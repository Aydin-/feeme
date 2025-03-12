import { useState, useEffect } from 'react';
import axios from 'axios';
import { MEMPOOL_API_URL } from '../config/constants';

export const useHashrateHistory = (timespan = '1m') => {
  const [hashrateData, setHashrateData] = useState({
    timestamps: [],
    hashrates: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchHashrateHistory = async () => {
      try {
        setHashrateData(prev => ({ ...prev, loading: true, error: null }));
        
        // The correct endpoint structure for mempool.space API
        const response = await axios.get(`${MEMPOOL_API_URL}/v1/mining/hashrate/${timespan}`);
        
        if (!response.data || !response.data.hashrates) {
          throw new Error('Invalid data format received');
        }

        const data = response.data.hashrates;
        const timestamps = data.map(point => new Date(point.timestamp * 1000));
        const hashrates = data.map(point => point.avgHashrate / 1e9); // Convert to EH/s

        setHashrateData({
          timestamps,
          hashrates,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Hashrate fetch error:', err);
        setHashrateData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch hashrate data: ' + (err.response?.status === 404 ? 'Data not available for selected timespan' : err.message)
        }));
      }
    };

    fetchHashrateHistory();
  }, [timespan]);

  return hashrateData;
}; 