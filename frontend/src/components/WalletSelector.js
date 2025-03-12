import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import { WALLET_CONFIGS, getWalletAdjustmentText } from '../config/walletConfigs';
import { WalletIcons } from '../config/walletIcons';

export const WalletSelector = ({ selectedWallet, onWalletSelect }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 2,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500
        }}
      >
        Select Your Wallet
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(WALLET_CONFIGS).map(([key, wallet]) => (
          <Grid item xs={6} sm={4} md={2.4} key={key}>
            <Card 
              className={`wallet-card ${selectedWallet === key ? 'selected' : ''}`}
              onClick={() => onWalletSelect(key)}
              sx={{
                cursor: 'pointer',
                p: 1.5,
                height: '100%',
                minHeight: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                overflow: 'visible',
                bgcolor: selectedWallet === key ? 'rgba(242, 169, 0, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                borderLeft: selectedWallet === key ? '3px solid #f2a900' : '3px solid transparent',
                '&:hover': {
                  bgcolor: selectedWallet === key ? 'rgba(242, 169, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateY(-2px)',
                  boxShadow: selectedWallet === key ? 
                    '0 4px 20px rgba(242, 169, 0, 0.15)' : 
                    '0 4px 20px rgba(0, 0, 0, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0)',
                }
              }}
            >
              <Box 
                sx={{ 
                  width: '32px', 
                  height: '32px', 
                  mb: 1,
                  opacity: selectedWallet === key ? 1 : 0.7,
                  transition: 'opacity 0.2s ease-in-out'
                }}
              >
                {WalletIcons[key]}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1rem',
                  mb: 0.5,
                  color: selectedWallet === key ? '#f2a900' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: selectedWallet === key ? 600 : 500,
                  textAlign: 'center'
                }}
              >
                {wallet.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: selectedWallet === key ? 
                    'rgba(255, 255, 255, 0.9)' : 
                    'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.3,
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}
              >
                {wallet.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 2,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          fontStyle: 'italic'
        }}
      >
        {getWalletAdjustmentText(selectedWallet)}
      </Typography>
    </Box>
  );
}; 