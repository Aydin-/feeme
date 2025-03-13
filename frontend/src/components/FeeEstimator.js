import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WALLET_CONFIGS } from '../config/walletConfigs';

const FeeEstimator = ({
  transactionSize,
  onSizeChange,
  selectedWallet,
  onWalletSelect,
  fees,
  loading,
  showFiat,
  onFiatToggle,
  fiatLoading,
  convertBtcToFiat
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('calculateFee')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('transactionSize')}
              type="number"
              value={transactionSize}
              onChange={onSizeChange}
              helperText={t('averageSize', { size: 225 })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('selectWallet')}</InputLabel>
              <Select
                value={selectedWallet}
                onChange={(e) => onWalletSelect(e.target.value)}
                label={t('selectWallet')}
              >
                {Object.keys(WALLET_CONFIGS).map((wallet) => (
                  <MenuItem key={wallet} value={wallet}>
                    {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={onFiatToggle}
          sx={{ mt: 2 }}
          disabled={fiatLoading}
        >
          {showFiat ? t('hideFiat') : t('showFiat')}
        </Button>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : fees ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('fast')}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {fees.fast} BTC
              </Typography>
              {showFiat && convertBtcToFiat(fees.fast) && (
                <Typography variant="body1" color="text.secondary">
                  €{convertBtcToFiat(fees.fast).eur} / 
                  kr{convertBtcToFiat(fees.fast).nok}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('medium')}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {fees.medium} BTC
              </Typography>
              {showFiat && convertBtcToFiat(fees.medium) && (
                <Typography variant="body1" color="text.secondary">
                  €{convertBtcToFiat(fees.medium).eur} / 
                  kr{convertBtcToFiat(fees.medium).nok}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('slow')}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {fees.slow} BTC
              </Typography>
              {showFiat && convertBtcToFiat(fees.slow) && (
                <Typography variant="body1" color="text.secondary">
                  €{convertBtcToFiat(fees.slow).eur} / 
                  kr{convertBtcToFiat(fees.slow).nok}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

export default FeeEstimator; 