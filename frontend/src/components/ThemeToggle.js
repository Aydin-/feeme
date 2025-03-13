import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={toggleDarkMode}
        sx={{
          borderRadius: 2,
          mb: 1,
          mx: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </ListItemIcon>
        <ListItemText 
          primary={isDarkMode ? t('darkMode') : t('lightMode')}
          sx={{ 
            textTransform: 'capitalize',
            '& .MuiListItemText-primary': {
              color: 'inherit'
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}; 