import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { formatBytes, formatNumber } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedGauge } from './AnimatedGauge';

export const MempoolStats = ({ mempoolStats }) => {
  const { t } = useLanguage();
  const MAX_MEMPOOL_SIZE = 300 * 1024 * 1024; // 300MB in bytes

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
          {t('mempoolStats')}
        </Typography>
        {mempoolStats ? (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              overflow: 'visible', // Allow glow effects to overflow
              mb: 4 // Add margin below gauge
            }}>
              <AnimatedGauge
                value={mempoolStats.mempoolSize}
                maxValue={MAX_MEMPOOL_SIZE}
                label={t('mempoolCapacity')}
                unit="MB"
                color="#f2a900"
              />
            </Box>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 2,
              width: '100%'
            }}>
              <Box sx={{ 
                width: '45%'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
                    {t('mempoolSize')}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#f2a900', mt: 1 }}>
                    {formatBytes(mempoolStats.mempoolSize)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                width: '45%'
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
                    {t('pendingTxs')}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#f2a900', mt: 1 }}>
                    {formatNumber(mempoolStats.mempoolTxs)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
            <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 