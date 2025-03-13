import React from 'react';
import { Box, Typography, Paper, Grid, useTheme } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { keyframes } from '@mui/system';

// Animations
const animations = {
  glow: keyframes`
    0% { text-shadow: 0 0 20px #f2a900, 0 0 40px #f2a900, 0 0 60px #f2a900; }
    50% { text-shadow: 0 0 40px #f2a900, 0 0 60px #f2a900, 0 0 80px #f2a900; }
    100% { text-shadow: 0 0 20px #f2a900, 0 0 40px #f2a900, 0 0 60px #f2a900; }
  `,
  float: keyframes`
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.02); }
    100% { transform: translateY(0px) scale(1); }
  `,
  shine: keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  `
};

// Styles
const styles = {
  container: {
    p: 3,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  titleContainer: {
    textAlign: 'center',
    mb: 6,
  },
  title: {
    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
    fontWeight: 900,
    color: 'text.primary',
    mb: 3,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    color: 'text.secondary',
    maxWidth: '800px',
    margin: '0 auto',
    fontWeight: 500,
  },
  card: {
    p: 3,
    height: '100%',
    background: 'linear-gradient(135deg, rgba(242,169,0,0.05) 0%, rgba(255,215,0,0.05) 100%)',
    border: '1px solid rgba(242,169,0,0.1)',
    boxShadow: '0 4px 20px rgba(242,169,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    }
  },
  cardTitle: {
    color: '#f2a900',
    fontWeight: 600
  }
};

const Home = () => {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <Box sx={styles.container}>
      <Box sx={styles.titleContainer}>
        <Typography
          variant="h1"
          component="h1"
          sx={styles.title}
        >
          Bitcoin Fee Estimator
        </Typography>
        <Typography
          variant="h5"
          sx={styles.subtitle}
        >
          {t('about.description')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={styles.card}>
            <Typography variant="h6" gutterBottom sx={styles.cardTitle}>
              {t('about.features')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={styles.card}>
            <Typography variant="h6" gutterBottom sx={styles.cardTitle}>
              {t('about.dataSource')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 