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

export const Header = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              Bitcoin Fee Estimator
            </Typography>
          </Box>

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
                <MenuItem onClick={handleAboutClick}>About</MenuItem>
                <MenuItem onClick={handleMenuClose} component="a" href="https://mempool.space" target="_blank">Explorer</MenuItem>
                <MenuItem onClick={handleMenuClose} component="a" href="https://github.com/Aydin-" target="_blank">GitHub</MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                onClick={handleAboutClick}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { color: '#f2a900' }
                }}
              >
                About
              </Button>
              <Button 
                color="inherit" 
                href="https://mempool.space"
                target="_blank"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { color: '#f2a900' }
                }}
              >
                Explorer
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
          About Bitcoin Fee Estimator
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            Bitcoin Fee Estimator is a professional-grade tool designed to help you calculate accurate transaction fees across different wallet implementations. Our estimator provides real-time data from the Bitcoin network and adjusts calculations based on specific wallet fee strategies.
          </DialogContentText>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            Features:
            • Real-time fee estimates from mempool.space
            • Support for popular wallets including Coinbase, Electrum, BlueWallet, and Exodus
            • Network hashrate monitoring
            • Mempool statistics
            • Blockchain information
          </DialogContentText>
          <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 2 }}>
            Data is sourced from mempool.space API and updated in real-time to ensure accuracy. This tool is ideal for both newcomers and experienced Bitcoin users looking to optimize their transaction fees.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}; 