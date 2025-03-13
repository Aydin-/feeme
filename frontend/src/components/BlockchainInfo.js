import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { formatNumber } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

export const BlockchainInfo = ({ blockchainInfo }) => {
  const { t } = useLanguage();

  return (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('blockchainInfo')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                {t('blockHeight')}
              </Typography>
              <Typography variant="h6" className="stat-value">
                {formatNumber(blockchainInfo.blocks)}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="stat-display">
              <Typography className="stat-label">
                {t('difficultyAdjustment')}
              </Typography>
              <Typography variant="h6" className="stat-value">
                {blockchainInfo.progressPercent?.toFixed(2)}%
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('difficultyProgress')}
              </Typography>
              <GaugeChart
                id="difficulty-gauge"
                nrOfLevels={20}
                percent={blockchainInfo.progressPercent / 100}
                colors={['#f2a900']}
                textColor="#ffffff"
                formatTextValue={value => `${value}%`}
              />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                {t('estimatedAdjustment', { date: blockchainInfo.nextRetargetDate })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 