import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguage } from '../contexts/LanguageContext';

const popularCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'Ξ' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'Ð' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' }
];

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = 'coin_prices_cache';
const PORTFOLIO_KEY = 'portfolio_data';

const getCachedPrices = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const { prices, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  return prices;
};

const setCachedPrices = (prices) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    prices,
    timestamp: Date.now()
  }));
};

const getPortfolioData = () => {
  const data = localStorage.getItem(PORTFOLIO_KEY);
  return data ? JSON.parse(data) : [];
};

const setPortfolioData = (coins) => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(coins));
};

const Portfolio = () => {
  const { t } = useLanguage();
  const [coins, setCoins] = useState(getPortfolioData());
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [newCoin, setNewCoin] = useState({ 
    id: '', 
    name: '', 
    symbol: '',
    amount: '0' 
  });

  // Save portfolio data whenever it changes
  useEffect(() => {
    setPortfolioData(coins);
  }, [coins]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (coins.length === 0) return;
      
      // Check cache first
      const cachedPrices = getCachedPrices();
      if (cachedPrices) {
        setPrices(cachedPrices);
        return;
      }
      
      setLoading(true);
      try {
        const coinIds = coins.map(coin => coin.id).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=eur`
        );
        const data = await response.json();
        setPrices(data);
        setCachedPrices(data);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // If API fails, try to use cached data even if expired
        const cachedPrices = getCachedPrices();
        if (cachedPrices) {
          setPrices(cachedPrices);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [coins]);

  const handleCoinSelect = (e) => {
    const selected = popularCoins.find(c => c.id === e.target.value);
    if (!selected) return;
    
    const existingCoin = coins.find(c => c.id === selected.id);
    
    setNewCoin({
      id: selected.id,
      name: selected.name,
      symbol: selected.symbol,
      amount: existingCoin ? existingCoin.amount.toString() : ''
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNewCoin(prev => ({ ...prev, amount: value }));
    }
  };

  const handleAddCoin = () => {
    if (!newCoin.id || !newCoin.amount || parseFloat(newCoin.amount) <= 0) return;

    const existingIndex = coins.findIndex(c => c.id === newCoin.id);
    
    if (existingIndex >= 0) {
      // Update existing coin amount
      setCoins(coins.map((coin, index) => 
        index === existingIndex 
          ? { ...coin, amount: parseFloat(newCoin.amount) }
          : coin
      ));
    } else {
      // Add new coin
      setCoins([...coins, { ...newCoin, amount: parseFloat(newCoin.amount) }]);
    }
    
    setNewCoin({ 
      id: '', 
      name: '', 
      symbol: '',
      amount: '' 
    });
  };

  const handleDeleteCoin = (index) => {
    setCoins(coins.filter((_, i) => i !== index));
  };

  const calculateTotalValue = () => {
    return coins.reduce((total, coin) => {
      const price = prices[coin.id]?.eur || 0;
      return total + (coin.amount * price);
    }, 0);
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('Portfolio')}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Input Panel */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            flex: '0 0 300px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('Add New Coin')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <Select
                value={newCoin.id}
                onChange={handleCoinSelect}
                displayEmpty
                renderValue={(selected) => {
                  if (selected === '') {
                    return <em>{t('Select Coin')}</em>;
                  }
                  const coin = popularCoins.find(c => c.id === selected);
                  return `${coin.name} (${coin.symbol})`;
                }}
              >
                <MenuItem disabled value="">
                  <em>{t('Select Coin')}</em>
                </MenuItem>
                {popularCoins.map((coin) => (
                  <MenuItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label={t('Amount')}
              type="text"
              value={newCoin.amount}
              onChange={handleAmountChange}
              disabled={!newCoin.id}
              InputProps={{ 
                inputProps: { 
                  min: 0, 
                  step: 0.00000001,
                  pattern: '[0-9]*\\.?[0-9]*'
                } 
              }}
              fullWidth
            />
            
            <Button 
              variant="contained" 
              onClick={handleAddCoin}
              disabled={!newCoin.id || !newCoin.amount || parseFloat(newCoin.amount) <= 0}
              fullWidth
              sx={{ mt: 1 }}
            >
              {coins.some(c => c.id === newCoin.id) ? t('Update Amount') : t('Add Coin')}
            </Button>
          </Box>
        </Paper>

        {/* Coin List Panel */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            flex: 1,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('Your Holdings')}
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {coins.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {t('No coins added yet')}
            </Typography>
          ) : (
            <>
              <List>
                {coins.map((coin, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      background: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={`${coin.name} (${coin.symbol})`}
                      secondary={`${coin.amount} ${coin.symbol} = ${formatValue(coin.amount * (prices[coin.id]?.eur || 0))}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteCoin(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  textAlign: 'right',
                  pt: 2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {t('Portfolio Value')}: {formatValue(calculateTotalValue())}
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Portfolio; 