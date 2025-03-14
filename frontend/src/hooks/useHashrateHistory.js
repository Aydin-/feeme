import { useState, useEffect } from 'react';
import axios from 'axios';
import { MEMPOOL_API_URL } from '../config/constants';

export const useHashrateHistory = (timespan = '3y') => {
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
        
        // Use 5y for 'all' timespan to get maximum available data
        const apiTimespan = timespan === 'all' ? '5y' : timespan;
        
        const response = await fetch(`${MEMPOOL_API_URL}/v1/mining/hashrate/${apiTimespan}`);
        const data = await response.json();

        if (!data.hashrates || !Array.isArray(data.hashrates)) {
          throw new Error('Invalid data format');
        }

        const processedData = data.hashrates
          .filter(item => item.timestamp && typeof item.avgHashrate === 'number')
          .map(item => ({
            timestamp: new Date(item.timestamp * 1000),
            hashrate: item.avgHashrate / 1e18
          }));

        setHashrateData({
          timestamps: processedData.map(item => item.timestamp),
          hashrates: processedData.map(item => item.hashrate),
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Hashrate fetch error:', err);
        console.log('Error details:', {
          message: err.message,
          response: err.response,
          data: err.response?.data
        });
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