import React from 'react';
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import { PremiumFeatures } from './PremiumFeatures';
import { useLanguage } from '../contexts/LanguageContext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export function Premium() {
  const { t } = useLanguage();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6, position: 'relative' }}>
        {/* Coming Soon Overlay */}
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 2,
            borderRadius: 2
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: 60, color: '#f2a900', mb: 2 }} />
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Coming Soon
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: '#ffffff',
              maxWidth: 600,
              mb: 4
            }}
          >
            We're working hard to bring you these premium features. Stay tuned for updates!
          </Typography>
        </Paper>

        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold',
            mb: 4,
            opacity: 0.5
          }}
        >
          {t('Premium Features')}
        </Typography>

        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 6, opacity: 0.5 }}
        >
          {t('Unlock the full potential of our fee calculator')}
        </Typography>

        <Box sx={{ opacity: 0.5 }}>
          <PremiumFeatures />
        </Box>

        <Box sx={{ mt: 8, opacity: 0.5 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ mb: 4 }}
          >
            {t('Why Choose Premium?')}
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('Professional Grade Tools')}
                </Typography>
                <Typography color="text.secondary">
                  {t('Access advanced analytics and professional-grade tools designed for serious traders and developers.')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('Real-time Data')}
                </Typography>
                <Typography color="text.secondary">
                  {t('Get instant access to real-time market data, network statistics, and historical trends.')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('Priority Support')}
                </Typography>
                <Typography color="text.secondary">
                  {t('Receive dedicated support and early access to new features as they become available.')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
} 