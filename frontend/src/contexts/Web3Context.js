import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

const Web3Context = createContext(null);

const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet to connect.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      console.log('Requesting account access...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);

      console.log('Creating provider...');
      const provider = new BrowserProvider(window.ethereum);
      console.log('Getting network...');
      const network = await provider.getNetwork();
      
      console.log('Setting account and chainId...');
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setProvider(provider);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    try {
      console.log('Disconnecting wallet...');
      setError(null);
      setAccount(null);
      setChainId(null);
      setProvider(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setError('Failed to disconnect wallet. Please try again.');
    }
  };

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          console.log('Checking existing connection...');
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('Found existing connection:', accounts[0]);
            const provider = new BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));
            setProvider(provider);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      console.log('Setting up event listeners...');
      
      const handleAccountsChanged = (accounts) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        console.log('Chain changed:', chainId);
        setChainId(Number(chainId));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        console.log('Cleaning up event listeners...');
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    account,
    chainId,
    connect,
    disconnect,
    active: !!account,
    error,
    isConnecting,
    provider
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3ContextProvider = ({ children }) => {
  return <Web3Provider>{children}</Web3Provider>;
}; 