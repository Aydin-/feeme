import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export function Navigation({ currentPage, onPageChange }) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'fees', label: t('Fees'), icon: <CalculateIcon /> },
    { id: 'portfolio', label: t('Portfolio'), icon: <AccountBalanceWalletIcon /> },
    { id: 'price-history', label: t('Price History'), icon: <TimelineIcon /> },
    { id: 'inspiration', label: t('Inspiration'), icon: <LightbulbIcon /> },
    { id: 'premium', label: t('Premium'), icon: <StarIcon /> }
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: 240,
        flexShrink: 0,
        background: 'transparent',
        position: 'sticky',
        top: 24,
        height: 'fit-content'
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => onPageChange(item.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(242, 169, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(242, 169, 0, 0.15)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#f2a900',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#f2a900',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 