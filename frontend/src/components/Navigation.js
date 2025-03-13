import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export const Navigation = ({ currentPage, onPageChange }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useAppTheme();
  const theme = useTheme();

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

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      mr: 4,
      width: '200px',
      flexShrink: 0,
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
        startIcon={<ReceiptIcon />}
        onClick={() => onPageChange('fees')}
        className={currentPage === 'fees' ? 'active' : ''}
      >
        {t('Fees')}
      </Button>
      <Button
        startIcon={<ShowChartIcon />}
        onClick={() => onPageChange('price')}
        className={currentPage === 'price' ? 'active' : ''}
      >
        {t('Price History')}
      </Button>
    </Box>
  );
}; 