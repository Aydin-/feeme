import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import { WALLET_CONFIGS, getWalletAdjustmentText } from '../config/walletConfigs';

export const WalletSelector = ({ selectedWallet, onWalletSelect }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Wallet
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(WALLET_CONFIGS).map(([key, wallet]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card 
              className={`wallet-card ${selectedWallet === key ? 'selected' : ''}`}
              onClick={() => onWalletSelect(key)}
              sx={{
                cursor: 'pointer',
                p: 2,
                bgcolor: selectedWallet === key ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <Typography variant="subtitle1">{wallet.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {wallet.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mt: 2, textAlign: 'center' }}
      >
        {getWalletAdjustmentText(selectedWallet)}
      </Typography>
    </Box>
  );
}; 