import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Paper,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';

export function Navigation({ currentPage, onPageChange }) {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'fees', label: t('Fees'), icon: <CalculateIcon /> },
    { id: 'portfolio', label: t('Portfolio'), icon: <AccountBalanceWalletIcon /> },
    { id: 'price-history', label: t('Price History'), icon: <TimelineIcon /> },
    { id: 'inspiration', label: t('Inspiration'), icon: <LightbulbIcon /> },
    { id: 'premium', label: t('Premium'), icon: <StarIcon /> },
    { id: 'contribute', label: t('Contribute'), icon: <FavoriteIcon /> },
    { id: 'explorer', label: t('explorer'), icon: <ExploreIcon /> },
    { id: 'about', label: t('aboutMenu'), icon: <InfoIcon /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      minHeight: isMobile ? '100vh' : 'auto'
    }}>
      <List sx={{ 
        width: '100%', 
        pt: { xs: 8, md: 2 },
        flex: 1
      }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handlePageChange(item.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
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
      <Box sx={{ mt: 'auto', pb: 2 }}>
        <Divider sx={{ mx: 2, mb: 2 }} />
        <List sx={{ width: '100%' }}>
          <ThemeToggle />
        </List>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed',
            right: 16,
            top: 80,
            zIndex: 1200,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              bgcolor: 'background.paper',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: 240,
        flexShrink: 0,
        background: 'transparent',
        position: 'sticky',
        top: 24,
        height: 'fit-content',
        display: { xs: 'none', md: 'block' }
      }}
    >
      {drawerContent}
    </Paper>
  );
} 