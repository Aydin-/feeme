import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import { WALLET_CONFIGS } from '../config/walletConfigs';
import { WalletIcons } from '../config/walletIcons';
import { useLanguage } from '../contexts/LanguageContext';

export const WalletSelector = ({ selectedWallet, onWalletSelect }) => {
  const { t } = useLanguage();

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
        {t('selectWallet')}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(WALLET_CONFIGS).map(([key, wallet]) => (
          <Grid item xs={6} sm={4} md={2.4} key={key}>
            <Card 
              className={`wallet-card ${selectedWallet === key ? 'selected' : ''}`}
              onClick={() => onWalletSelect(key)}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: selectedWallet === key ? '2px solid #f2a900' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease-in-out',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(242, 169, 0, 0.5)',
                }
              }}
            >
              <Box 
                sx={{ 
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1
                }}
              >
                {WalletIcons[key]}
              </Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  textAlign: 'center',
                  color: '#f2a900',
                  fontWeight: 600,
                  mb: 0.5
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  lineHeight: 1.2
                }}
              >
                {t(`walletDescriptions.${key}`)}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedWallet && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2,
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          {t(`walletAdjustments.${selectedWallet}`)}
        </Typography>
      )}
    </Box>
  );
}; 