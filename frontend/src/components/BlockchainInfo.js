import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { formatNumber } from '../utils/formatters';

export const BlockchainInfo = ({ blockchainInfo }) => {
  return (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Blockchain Info
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                Block Height
              </Typography>
              <Typography variant="h6" className="stat-value">
                {formatNumber(blockchainInfo.blocks)}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                Difficulty Adjustment
              </Typography>
              <Typography variant="h6" className="stat-value">
                {blockchainInfo.progressPercent?.toFixed(2)}%
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Difficulty Adjustment Progress
              </Typography>
              <GaugeChart
                id="difficulty-gauge"
                nrOfLevels={20}
                percent={blockchainInfo.progressPercent ? blockchainInfo.progressPercent / 100 : 0}
                colors={['#f2a900']}
                textColor="#ffffff"
              />
              {blockchainInfo.estimatedRetargetDate && (
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Estimated adjustment: {new Date(blockchainInfo.estimatedRetargetDate * 1000).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 