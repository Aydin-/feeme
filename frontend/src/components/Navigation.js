import React, { useState } from 'react';
import { Box, Button, useTheme, useMediaQuery, Drawer, IconButton } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const Navigation = ({ currentPage, onPageChange }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const buttonStyle = {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    '&:hover': {
      color: '#f2a900',
      backgroundColor: 'rgba(242, 169, 0, 0.1)',
    },
    '&.active': {
      color: '#f2a900',
      backgroundColor: 'rgba(242, 169, 0, 0.1)',
      boxShadow: '0 0 15px rgba(242, 169, 0, 0.2)',
    },
  };

  const navigationContent = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      width: isMobile ? '100%' : '200px',
      flexShrink: 0,
      p: isMobile ? 2 : 0,
      '& .MuiButton-root': {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        justifyContent: 'flex-start',
        width: '100%',
        ...buttonStyle
      }
    }}>
      <Button
        variant={currentPage === 'fees' ? 'contained' : 'text'}
        onClick={() => {
          onPageChange('fees');
          if (isMobile) setDrawerOpen(false);
        }}
        startIcon={<CalculateIcon />}
        fullWidth
      >
        {t('Fees')}
      </Button>
      <Button
        variant={currentPage === 'portfolio' ? 'contained' : 'text'}
        onClick={() => {
          onPageChange('portfolio');
          if (isMobile) setDrawerOpen(false);
        }}
        startIcon={<AccountBalanceWalletIcon />}
        fullWidth
      >
        {t('Portfolio')}
      </Button>
      <Button
        variant={currentPage === 'price-history' ? 'contained' : 'text'}
        onClick={() => {
          onPageChange('price-history');
          if (isMobile) setDrawerOpen(false);
        }}
        startIcon={<ShowChartIcon />}
        fullWidth
      >
        {t('Price History')}
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: '#f2a900',
            color: 'white',
            '&:hover': {
              bgcolor: '#e69a00',
            },
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(242, 169, 0, 0.3)',
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              width: '80%',
              maxWidth: '300px',
            }
          }}
        >
          {navigationContent}
        </Drawer>
      </>
    );
  }

  return navigationContent;
}; 