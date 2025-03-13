import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import HistoryIcon from '@mui/icons-material/History';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';

export function PremiumFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('Advanced Analytics'),
      description: t('Get detailed fee predictions and network analysis'),
      icon: <SpeedIcon />,
      price: '$9.99/month'
    },
    {
      title: t('Historical Data'),
      description: t('Access historical fee data and trends'),
      icon: <HistoryIcon />,
      price: '$14.99/month'
    },
    {
      title: t('API Access'),
      description: t('Integrate our API into your applications'),
      icon: <CodeIcon />,
      price: '$29.99/month'
    },
    {
      title: t('Enterprise'),
      description: t('Custom solutions for businesses'),
      icon: <GroupIcon />,
      price: t('Contact us')
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        {t('Premium Features')}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        {t('Unlock the full potential of our fee calculator')}
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}
              >
                <LockIcon sx={{ fontSize: 16, color: '#f2a900' }} />
                <Typography variant="caption" sx={{ color: '#ffffff' }}>
                  Coming Soon
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: 'primary.main', mr: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                </Box>
                
                <Typography color="text.secondary" paragraph>
                  {feature.description}
                </Typography>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('Priority Support')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('No Ads')} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('Early Access')} />
                  </ListItem>
                </List>

                <Typography variant="h6" color="primary" align="center" sx={{ mt: 2 }}>
                  {feature.price}
                </Typography>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Tooltip title="Coming Soon" arrow>
                  <span>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      color="primary"
                      disabled
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1,
                        opacity: 0.7
                      }}
                    >
                      {t('Subscribe Now')}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 