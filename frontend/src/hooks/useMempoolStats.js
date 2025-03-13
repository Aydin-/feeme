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
      
      setMempoolStats(prev => ({
        ...prev,
        mempoolSize: mempoolResponse.data.vsize || prev.mempoolSize,
        mempoolTxs: mempoolResponse.data.count || prev.mempoolTxs,
        totalFees: mempoolResponse.data.total_fee || prev.totalFees,
        medianFee: mempoolResponse.data.vsize > 0 ? 
          Math.round((mempoolResponse.data.total_fee / mempoolResponse.data.vsize) * 100) / 100 : prev.medianFee
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