import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize provider when ethereum is available
  useEffect(() => {
    const initProvider = async () => {
      try {
        if (window.ethereum) {
          console.log('Ethereum detected, initializing provider...');
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('Already connected with account:', accounts[0]);
            setAccount(accounts[0]);
          }

          // Get current chain ID
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
        } else {
          console.log('No Ethereum provider found');
          setError('No Web3 wallet found');
        }
      } catch (err) {
        console.error('Provider initialization error:', err);
        setError(err.message);
      }
    };

    initProvider();
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error('No Web3 wallet found');
      }

      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      console.log('Requesting chain ID...');
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Chain ID received:', chainId);

      setAccount(accounts[0]);
      setChainId(parseInt(chainId, 16));

      // Set up event listeners
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Accounts changed:', accounts);
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed:', chainId);
        setChainId(parseInt(chainId, 16));
      });

      window.ethereum.on('disconnect', () => {
        console.log('Wallet disconnected');
        disconnect();
      });

    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    console.log('Disconnecting wallet...');
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const value = {
    account,
    chainId,
    provider,
    error,
    isConnecting,
    connect,
    disconnect
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
} 