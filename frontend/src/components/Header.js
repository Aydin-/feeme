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
import { ExplorerDrawer } from './ExplorerDrawer';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

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
            <ThemeToggle />
            <LanguageSelector />
            
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  className="header-icon-button"
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
                  className="header-button"
                >
                  {t('aboutMenu')}
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleExplorerClick}
                  className="header-button"
                >
                  {t('explorer')}
                </Button>
                <Button 
                  color="inherit"
                  href="https://github.com/Aydin-"
                  target="_blank"
                  className="header-button"
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
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            '& .MuiDialogTitle-root': {
              background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
              color: 'white',
            },
            '& .MuiDialogContent-root': {
              bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
            },
            '& .MuiDialogContentText-root': {
              color: isDarkMode ? '#ffffff' : '#000000',
            }
          }
        }}
      >
        <DialogTitle className="dialog-title">
          {t('title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-content-text">
            {t('about.description')}
          </DialogContentText>
          <DialogContentText className="dialog-content-text">
            {t('about.features')}
          </DialogContentText>
          <DialogContentText className="dialog-content-text">
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