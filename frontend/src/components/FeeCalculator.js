import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, IconButton, InputBase, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { WalletSelector } from './WalletSelector';
import { DEFAULT_TX_SIZE } from '../config/constants';
import { useLanguage } from '../contexts/LanguageContext';

export const FeeCalculator = ({
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
  const { t } = useLanguage();

  const handleIncrement = () => {
    const newValue = parseInt(transactionSize) + 1;
    onSizeChange({ target: { value: newValue.toString() } });
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(transactionSize) - 1);
    onSizeChange({ target: { value: newValue.toString() } });
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      onSizeChange(event);
    }
  };

  return (
    <Card className="glass-card" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          fontSize: '1.25rem',
          mb: 3
        }}>
          {t('calculateFee')}
        </Typography>

        <WalletSelector 
          selectedWallet={selectedWallet} 
          onWalletSelect={onWalletSelect}
        />

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('transactionSize')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('averageSize', { size: DEFAULT_TX_SIZE })}
          </Typography>
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 250,
              bgcolor: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <IconButton onClick={handleDecrement}>
              <RemoveIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={transactionSize}
              onChange={handleInputChange}
              inputProps={{ 'aria-label': 'transaction size' }}
            />
            <IconButton onClick={handleIncrement}>
              <AddIcon />
            </IconButton>
          </Paper>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
            <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
          </Box>
        ) : fees ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-fast">
                  <Typography variant="body2" color="text.secondary">
                    {t('fast')}
                  </Typography>
                  <Typography variant="h6">{fees.fast} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" sx={{ ml: 1 }}>{t('loading')}</Typography>
                        </Box>
                      ) : (
                        <>
                          {convertBtcToFiat(fees.fast)?.eur && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.fast).eur}</span>
                              <span className="currency">EUR</span>
                            </div>
                          )}
                          {convertBtcToFiat(fees.fast)?.nok && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.fast).nok}</span>
                              <span className="currency">NOK</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-medium">
                  <Typography variant="body2" color="text.secondary">
                    {t('medium')}
                  </Typography>
                  <Typography variant="h6">{fees.medium} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" sx={{ ml: 1 }}>{t('loading')}</Typography>
                        </Box>
                      ) : (
                        <>
                          {convertBtcToFiat(fees.medium)?.eur && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.medium).eur}</span>
                              <span className="currency">EUR</span>
                            </div>
                          )}
                          {convertBtcToFiat(fees.medium)?.nok && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.medium).nok}</span>
                              <span className="currency">NOK</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-slow">
                  <Typography variant="body2" color="text.secondary">
                    {t('slow')}
                  </Typography>
                  <Typography variant="h6">{fees.slow} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" sx={{ ml: 1 }}>{t('loading')}</Typography>
                        </Box>
                      ) : (
                        <>
                          {convertBtcToFiat(fees.slow)?.eur && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.slow).eur}</span>
                              <span className="currency">EUR</span>
                            </div>
                          )}
                          {convertBtcToFiat(fees.slow)?.nok && (
                            <div>
                              <span className="amount">{convertBtcToFiat(fees.slow).nok}</span>
                              <span className="currency">NOK</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={onFiatToggle}
              >
                {showFiat ? t('hideFiat') : t('showFiat')}
              </Typography>
            </Box>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}; 