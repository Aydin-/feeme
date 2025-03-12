import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { FeeHistoryChart } from './FeeHistoryChart';

export const NetworkStatus = ({ networkStatus, feeHistory }) => {
  return (
    <Card className="glass-card" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Status
        </Typography>
        {networkStatus ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-fast">
                  <Typography className="fee-label">
                    Fast Fee
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.fastestFee} sats/vB
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-medium">
                  <Typography className="fee-label">
                    Medium Fee
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.halfHourFee} sats/vB
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-slow">
                  <Typography className="fee-label">
                    Slow Fee
                  </Typography>
                  <Typography variant="h6" className="fee-value">
                    {networkStatus.hourFee} sats/vB
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <FeeHistoryChart feeHistory={feeHistory} />
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 