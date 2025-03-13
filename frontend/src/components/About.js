import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

export function About() {
  const { t } = useLanguage();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
      <Paper 
        sx={{ 
          p: 4, 
          mt: 3,
          background: 'linear-gradient(135deg, rgba(242,169,0,0.05) 0%, rgba(255,215,0,0.05) 100%)',
          border: '1px solid rgba(242,169,0,0.1)',
          boxShadow: '0 4px 20px rgba(242,169,0,0.1)'
        }}
      >
        <Typography variant="body1" paragraph>
          {t('about.description')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('about.features')}
        </Typography>
        <Typography variant="body1">
          {t('about.dataSource')}
        </Typography>
      </Paper>
    </Box>
  );
} 