import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { formatBytes, formatNumber } from '../utils/formatters';

export const MempoolStats = ({ mempoolStats }) => {
  return (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mempool Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                Mempool Size
              </Typography>
              <Typography variant="h6" className="stat-value">
                {formatBytes(mempoolStats.mempoolSize)}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                Pending Transactions
              </Typography>
              <Typography variant="h6" className="stat-value">
                {formatNumber(mempoolStats.mempoolTxs)}
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
      </CardContent>
    </Card>
  );
}; 