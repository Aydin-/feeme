import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { FeeHistoryChart } from './FeeHistoryChart';
import { useLanguage } from '../contexts/LanguageContext';

export const NetworkStatus = ({ networkStatus, feeHistory }) => {
  const { t } = useLanguage();

  return (
    <Card className="glass-card" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          fontSize: '1.25rem',
          mb: 3
        }}>
          {t('networkStatus')}
        </Typography>
        {networkStatus ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-fast">
                  <Typography className="fee-label">
                    {t('fastFee')}
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.fastestFee} sats/vB
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-medium">
                  <Typography className="fee-label">
                    {t('mediumFee')}
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.halfHourFee} sats/vB
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-slow">
                  <Typography className="fee-label">
                    {t('slowFee')}
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.hourFee} sats/vB
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('feeHistory')}
              </Typography>
              <FeeHistoryChart feeHistory={feeHistory} />
            </Box>
          </>
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