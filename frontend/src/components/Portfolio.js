import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguage } from '../contexts/LanguageContext';

const Portfolio = () => {
  const { t } = useLanguage();
  const [coins, setCoins] = useState([]);
  const [newCoin, setNewCoin] = useState({ name: '', amount: '' });

  const handleAddCoin = () => {
    if (newCoin.name && newCoin.amount) {
      setCoins([...coins, { ...newCoin, amount: parseFloat(newCoin.amount) }]);
      setNewCoin({ name: '', amount: '' });
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
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label={t('Coin Name')}
            value={newCoin.name}
            onChange={(e) => setNewCoin({ ...newCoin, name: e.target.value })}
            size="small"
          />
          <TextField
            label={t('Amount')}
            type="number"
            value={newCoin.amount}
            onChange={(e) => setNewCoin({ ...newCoin, amount: e.target.value })}
            size="small"
          />
          <Button variant="contained" onClick={handleAddCoin}>
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
                primary={coin.name}
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