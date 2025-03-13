import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

const Web3Context = createContext(null);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3ContextProvider');
  }
  return context;
}

export function Web3ContextProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const connect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet found');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setAccount(accounts[0]);
      setChainId(parseInt(chainId, 16));

      // Set up event listeners
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const value = {
    account,
    chainId,
    provider,
    error,
    connect,
    disconnect
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
} 