import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { formatNumber } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedGauge } from './AnimatedGauge';

export const BlockchainInfo = ({ blockchainInfo }) => {
  const { t } = useLanguage();

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="glass-card">
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          fontSize: '1.25rem',
          mb: 3
        }}>
          {t('blockchainInfo')}
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              overflow: 'visible', // Allow glow effects to overflow
              ml: 12 // Increased left margin to move gauge right
            }}>
              <AnimatedGauge
                value={blockchainInfo.progressPercent || 0}
                maxValue={100}
                label={t('difficultyProgress')}
                color="#f2a900"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              ml: -4 // Move inner panels left to balance with gauge
            }}>
              <Box sx={{ 
                width: '50%',
                mb: 2
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
                    {t('blockHeight')}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#f2a900', mt: 1 }}>
                    {formatNumber(blockchainInfo.blocks)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: '50%'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
                    {t('estimatedAdjustment').replace('{date}', formatDate(blockchainInfo.estimatedRetargetDate))}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#f2a900', mt: 1 }}>
                    {blockchainInfo.difficulty ? formatNumber(blockchainInfo.difficulty) : ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 