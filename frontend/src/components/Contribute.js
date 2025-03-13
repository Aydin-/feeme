import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { styled } from '@mui/material/styles';
import { QRCodeSVG } from 'qrcode.react';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const AddressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  '& canvas': {
    maxWidth: '100%',
    height: 'auto',
  }
}));

export function Contribute() {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState({ open: false, address: '', type: '' });

  const addresses = {
    eth: '0x871577C69974082D33c04F6f015be994478AC54B',
    btc: 'bc1qw75a47kx6h508urlrm784mr9mmnfxccghun6q2'
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setShowCopiedAlert(true);
  };

  const handleCloseAlert = () => {
    setShowCopiedAlert(false);
  };

  const handleShowQRCode = (type, address) => {
    setQrCodeDialog({ open: true, address, type });
  };

  const handleCloseQRCode = () => {
    setQrCodeDialog({ open: false, address: '', type: '' });
  };

  const renderAddressCard = (type, address) => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {type === 'eth' ? t('Ethereum Address') : t('Bitcoin Address')}
        </Typography>
        <AddressBox>
          <Typography 
            variant="body2" 
            sx={{ 
              flex: 1,
              wordBreak: 'break-all',
              fontFamily: 'monospace'
            }}
          >
            {address}
          </Typography>
          <Tooltip title={t('Copy Address')}>
            <IconButton 
              size="small" 
              onClick={() => handleCopyAddress(address)}
              sx={{ color: theme.palette.primary.main }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Show QR Code')}>
            <IconButton 
              size="small" 
              onClick={() => handleShowQRCode(type, address)}
              sx={{ color: theme.palette.primary.main }}
            >
              <QrCode2Icon />
            </IconButton>
          </Tooltip>
        </AddressBox>
      </CardContent>
    </StyledCard>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Contribute')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('Support the development of this project by contributing ETH or BTC. Your contribution helps maintain and improve the service.')}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderAddressCard('eth', addresses.eth)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderAddressCard('btc', addresses.btc)}
          </Grid>
        </Grid>
      </Box>

      <Dialog 
        open={qrCodeDialog.open} 
        onClose={handleCloseQRCode}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {qrCodeDialog.type === 'eth' ? t('Ethereum Address QR Code') : t('Bitcoin Address QR Code')}
        </DialogTitle>
        <DialogContent>
          <QRCodeContainer>
            <QRCodeSVG
              value={qrCodeDialog.address}
              size={256}
              level="H"
              includeMargin={true}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                textAlign: 'center'
              }}
            >
              {qrCodeDialog.address}
            </Typography>
          </QRCodeContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQRCode} color="primary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopiedAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {t('Address copied to clipboard!')}
        </Alert>
      </Snackbar>
    </Box>
  );
} 