import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  useMediaQuery,
  useTheme
} from '@mui/material';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import WalletConnect from './WalletConnect';
import './Header.css';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();
  const { isDarkMode } = useAppTheme();

  return (
    <AppBar 
      position="fixed"
      sx={{
        bgcolor: isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'static',
        background: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 4
      }}
    >
      <Toolbar className="header-toolbar">
        <Box className="header-title-container">
          <Typography 
            variant="h5" 
            className="header-title"
          >
            {t('title')}
          </Typography>
        </Box>

        <Box className="header-actions">
          <LanguageSelector />
          <WalletConnect />
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 