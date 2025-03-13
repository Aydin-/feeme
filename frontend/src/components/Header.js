import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Link
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BitcoinLogo } from '../icons';
import { ExplorerDrawer } from './ExplorerDrawer';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { keyframes } from '@mui/system';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';

// Animations
const animations = {
  glow: keyframes`
    0% { text-shadow: 0 0 20px #f2a900, 0 0 40px #f2a900, 0 0 60px #f2a900; }
    50% { text-shadow: 0 0 40px #f2a900, 0 0 60px #f2a900, 0 0 80px #f2a900; }
    100% { text-shadow: 0 0 20px #f2a900, 0 0 40px #f2a900, 0 0 60px #f2a900; }
  `,
  float: keyframes`
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-5px) scale(1.02); }
    100% { transform: translateY(0px) scale(1); }
  `,
  shine: keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  `
};

// Styles
const styles = {
  title: {
    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
    fontWeight: 700,
    fontFamily: '"Playfair Display", serif',
    background: 'linear-gradient(45deg, rgba(242, 169, 0, 0.8) 30%, rgba(255, 215, 0, 0.8) 50%, rgba(242, 169, 0, 0.8) 70%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${animations.glow} 4s ease-in-out infinite, ${animations.shine} 4s linear infinite`,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    position: 'relative',
    textAlign: 'left',
    backdropFilter: 'blur(8px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: -4,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, rgba(242, 169, 0, 0.3), rgba(255, 215, 0, 0.3), rgba(242, 169, 0, 0.3))',
      borderRadius: '1px',
      animation: `${animations.glow} 4s ease-in-out infinite`,
    },
    '&::after': {
      content: '"₿"',
      position: 'absolute',
      top: -8,
      right: -8,
      fontSize: '1.2rem',
      color: 'rgba(242, 169, 0, 0.8)',
      animation: `${animations.float} 4s ease-in-out infinite`,
      animationDelay: '1s',
    }
  },
  toolbar: {
    justifyContent: 'space-between',
    minHeight: '64px',
    px: { xs: 2, sm: 4 },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  iconButton: {
    color: 'inherit',
    '&:hover': {
      color: '#f2a900',
    },
  },
};

export const Header = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useAppTheme();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAboutClick = () => {
    setAboutOpen(true);
    handleMenuClose();
  };

  const handleExplorerClick = () => {
    setExplorerOpen(true);
    handleMenuClose();
  };

  return (
    <>
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
        <Toolbar sx={styles.toolbar}>
          <Box sx={styles.titleContainer}>
            <BitcoinLogo style={{ width: 40, height: 40, marginRight: 2 }} />
            <Typography 
              variant="h5" 
              sx={styles.title}
            >
              {t('title')}
            </Typography>
          </Box>

          <Box sx={styles.actions}>
            <ThemeToggle />
            <LanguageSelector />
            
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleAboutClick}>{t('aboutMenu')}</MenuItem>
                  <MenuItem onClick={handleExplorerClick}>{t('explorer')}</MenuItem>
                  <MenuItem onClick={handleMenuClose} component="a" href="https://github.com/Aydin-" target="_blank">GitHub</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  onClick={handleAboutClick}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { color: '#f2a900' }
                  }}
                >
                  {t('aboutMenu')}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleExplorerClick}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { color: '#f2a900' }
                  }}
                >
                  {t('explorer')}
                </Button>
                <Button 
                  color="inherit"
                  href="https://github.com/Aydin-"
                  target="_blank"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { color: '#f2a900' }
                  }}
                >
                  GitHub
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
          color: 'white'
        }}>
          {t('title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            {t('about.description')}
          </DialogContentText>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            {t('about.features')}
          </DialogContentText>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            {t('about.dataSource')}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <ExplorerDrawer 
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
      />
    </>
  );
}; 