import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useWeb3 } from '../contexts/Web3Context';
import { useTheme } from '@mui/material/styles';

const WalletHoldings = () => {
  const { account, provider, active } = useWeb3();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!active || !provider || !account) {
        setHoldings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get native token balance (ETH, BNB, etc.)
        const balance = await provider.getBalance(account);
        const nativeTokenBalance = {
          symbol: 'ETH', // This will be updated based on chainId
          balance: balance.toString(),
          decimals: 18,
          name: 'Ethereum',
          logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
        };

        // TODO: Add ERC20 token balance fetching here
        // This would require:
        // 1. Getting a list of common ERC20 tokens for the current network
        // 2. Using their contract addresses to fetch balances
        // 3. Getting token metadata (symbol, decimals, name, logo)

        setHoldings([nativeTokenBalance]);
      } catch (err) {
        console.error('Error fetching wallet holdings:', err);
        setError('Failed to fetch wallet holdings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [active, provider, account]);

  if (!active) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 600,
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        mb: 2
      }}>
        Wallet Holdings
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : holdings.length === 0 ? (
        <Typography color="text.secondary">
          No holdings found
        </Typography>
      ) : (
        <Box>
          {holdings.map((token, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 1,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                  src={token.logo}
                  alt={token.symbol}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {token.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {token.name}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {(Number(token.balance) / Math.pow(10, token.decimals)).toFixed(4)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {token.symbol}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default WalletHoldings; 