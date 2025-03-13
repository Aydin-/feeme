import React, { useState } from 'react';
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
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguage } from '../contexts/LanguageContext';

const popularCoins = [
  { id: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { id: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP' },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA' },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'Ð' },
  { id: 'DOT', name: 'Polkadot', symbol: 'DOT' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL' },
  { id: 'MATIC', name: 'Polygon', symbol: 'MATIC' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK' }
];

const Portfolio = () => {
  const { t } = useLanguage();
  const [coins, setCoins] = useState([]);
  const [newCoin, setNewCoin] = useState({ 
    id: 'BTC', 
    name: 'Bitcoin', 
    symbol: '₿',
    amount: '' 
  });

  const handleAddCoin = () => {
    if (newCoin.amount) {
      setCoins([...coins, { ...newCoin, amount: parseFloat(newCoin.amount) }]);
      setNewCoin({ 
        id: 'BTC', 
        name: 'Bitcoin', 
        symbol: '₿',
        amount: '' 
      });
    }
  };

  const handleDeleteCoin = (index) => {
    setCoins(coins.filter((_, i) => i !== index));
  };

  const calculateTotalValue = () => {
    // This is a placeholder - in a real app, you would fetch current prices
    return coins.reduce((total, coin) => total + coin.amount, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('Portfolio')}
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('Select Coin')}</InputLabel>
            <Select
              value={newCoin.id}
              label={t('Select Coin')}
              onChange={(e) => {
                const selectedCoin = popularCoins.find(coin => coin.id === e.target.value);
                setNewCoin({
                  ...newCoin,
                  id: selectedCoin.id,
                  name: selectedCoin.name,
                  symbol: selectedCoin.symbol
                });
              }}
              size="small"
            >
              {popularCoins.map((coin) => (
                <MenuItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('Amount')}
            type="number"
            value={newCoin.amount}
            onChange={(e) => setNewCoin({ ...newCoin, amount: e.target.value })}
            size="small"
            sx={{ minWidth: 150 }}
          />
          <Button 
            variant="contained" 
            onClick={handleAddCoin}
            disabled={!newCoin.amount}
          >
            {t('Add Coin')}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('Your Holdings')}
        </Typography>
        <List>
          {coins.map((coin, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${coin.name} (${coin.symbol})`}
                secondary={`${t('Amount')}: ${coin.amount}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDeleteCoin(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('Total Value')}: {calculateTotalValue().toFixed(2)} BTC
        </Typography>
      </Paper>
    </Box>
  );
};

export default Portfolio; 