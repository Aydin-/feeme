import React from 'react';
import { Button, Typography, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3 } from '../contexts/Web3Context';

const WalletConnect = () => {
  const { account, connect, disconnect, active, error, isConnecting } = useWeb3();
  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleCloseError = () => {
    setShowError(false);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {active ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={disconnect}
          disabled={isConnecting}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 2,
            py: 1,
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
            },
          }}
        >
          <Typography variant="body2">
            {formatAddress(account)}
          </Typography>
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
          onClick={handleConnect}
          disabled={isConnecting}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <Typography variant="body2">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Typography>
        </Button>
      )}

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WalletConnect; 