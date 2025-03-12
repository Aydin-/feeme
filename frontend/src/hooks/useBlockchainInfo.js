import { useState, useEffect } from 'react';
import axios from 'axios';
import { MEMPOOL_API_URL } from '../config/constants';

export const useBlockchainInfo = () => {
  const [blockchainInfo, setBlockchainInfo] = useState({
    blocks: 0,
    difficulty: 0,
    progressPercent: 0,
    estimatedRetargetDate: null
  });

  const fetchBlockchainInfo = async () => {
    try {
      const [blocksResponse, difficultyResponse] = await Promise.all([
        axios.get(`${MEMPOOL_API_URL}/v1/blocks/tip/height`),
        axios.get(`${MEMPOOL_API_URL}/v1/difficulty-adjustment`)
      ]);
      
      setBlockchainInfo(prev => ({
        ...prev,
        blocks: blocksResponse.data || prev.blocks,
        difficulty: difficultyResponse.data.difficulty || prev.difficulty,
        progressPercent: difficultyResponse.data.progressPercent || prev.progressPercent,
        estimatedRetargetDate: difficultyResponse.data.estimatedRetargetDate ? 
          new Date(difficultyResponse.data.estimatedRetargetDate).getTime() / 1000 : prev.estimatedRetargetDate
      }));
    } catch (err) {
      console.error('Failed to fetch blockchain info:', err);
    }
  };

  useEffect(() => {
    fetchBlockchainInfo();
    const timer = setInterval(fetchBlockchainInfo, 120000); // Update every 2 minutes
    return () => clearInterval(timer);
  }, []);

  return blockchainInfo;
}; 