import { useState, useEffect } from 'react';
import axios from 'axios';
import { MEMPOOL_API_URL } from '../config/constants';

export const useMempoolStats = () => {
  const [mempoolStats, setMempoolStats] = useState({
    mempoolSize: 0,
    mempoolTxs: 0,
    totalFees: 0,
    medianFee: 0
  });

  const fetchMempoolStats = async () => {
    try {
      const mempoolResponse = await axios.get(`${MEMPOOL_API_URL}/mempool`);
      const data = mempoolResponse.data;
      
      setMempoolStats(prev => ({
        ...prev,
        mempoolSize: data.vsize || 0,
        mempoolTxs: data.count || 0,
        totalFees: data.total_fee || 0,
        medianFee: data.vsize > 0 ? 
          Math.round((data.total_fee / data.vsize) * 100) / 100 : 0
      }));
    } catch (err) {
      console.error('Failed to fetch mempool stats:', err);
    }
  };

  useEffect(() => {
    fetchMempoolStats();
    const timer = setInterval(fetchMempoolStats, 120000); // Update every 2 minutes
    return () => clearInterval(timer);
  }, []);

  return mempoolStats;
}; 