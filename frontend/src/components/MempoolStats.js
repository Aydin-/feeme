import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { formatBytes, formatNumber } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

export const MempoolStats = ({ mempoolStats }) => {
  const { t } = useLanguage();

  return (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('mempoolStats')}
        </Typography>
        {mempoolStats ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <div className="stat-display">
                <Typography className="stat-label">
                  {t('mempoolSize')}
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {formatBytes(mempoolStats.mempoolSize)}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="stat-display">
                <Typography className="stat-label">
                  {t('pendingTxs')}
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {formatNumber(mempoolStats.mempoolTxs)}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="stat-display">
                <Typography className="stat-label">
                  {t('mempoolCapacity')}
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {(mempoolStats.mempoolSize / (300 * 1024 * 1024) * 100).toFixed(1)}%
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mempool Capacity
                </Typography>
                <GaugeChart
                  id="mempool-gauge"
                  nrOfLevels={20}
                  percent={Math.min(mempoolStats.mempoolSize / (300 * 1024 * 1024), 1)}
                  colors={['#00C853', '#FFD600', '#FF3D00']}
                  textColor="#ffffff"
                />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 