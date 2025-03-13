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
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BitcoinLogo } from '../icons';
import { ExplorerDrawer } from './ExplorerDrawer';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

export const Header = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();

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
        position="static" 
        sx={{ 
          background: 'transparent', 
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          mb: 4
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BitcoinLogo style={{ width: 40, height: 40, marginRight: 2 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('title')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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