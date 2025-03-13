import React from 'react';
import { Button, Typography, Box, Snackbar, Alert, CircularProgress, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3 } from '../contexts/Web3Context';

const WalletConnect = () => {
  const { account, connect, disconnect, active, error, isConnecting, chainId } = useWeb3();
  const [showError, setShowError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  React.useEffect(() => {
    if (active) {
      setShowSuccess(true);
    }
  }, [active]);

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
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

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 3: return 'Ropsten Testnet';
      case 4: return 'Rinkeby Testnet';
      case 5: return 'Goerli Testnet';
      case 42: return 'Kovan Testnet';
      case 56: return 'BSC Mainnet';
      case 97: return 'BSC Testnet';
      default: return `Chain ${chainId}`;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {active ? (
        <Tooltip title={`Connected to ${getNetworkName(chainId)}`}>
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
        </Tooltip>
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

      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Wallet connected successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WalletConnect; 