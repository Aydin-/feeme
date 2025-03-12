import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, TextField } from '@mui/material';
import { WalletSelector } from './WalletSelector';
import { DEFAULT_TX_SIZE } from '../config/constants';

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
  return (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Calculate Transaction Fee
        </Typography>
        
        <WalletSelector 
          selectedWallet={selectedWallet}
          onWalletSelect={onWalletSelect}
        />

        <TextField
          fullWidth
          label="Transaction Size (bytes)"
          type="number"
          value={transactionSize}
          onChange={onSizeChange}
          helperText={`Average Bitcoin transaction is ~${DEFAULT_TX_SIZE} bytes`}
          InputProps={{
            inputProps: { 
              min: 0,
              step: 1
            }
          }}
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : fees ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <div className="fee-display fee-fast">
                  <Typography variant="body2" color="text.secondary">
                    Fast (10 min)
                  </Typography>
                  <Typography variant="h6">{fees.fast} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <CircularProgress size={16} />
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
                    Medium (30 min)
                  </Typography>
                  <Typography variant="h6">{fees.medium} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <CircularProgress size={16} />
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
                    Slow (1+ hour)
                  </Typography>
                  <Typography variant="h6">{fees.slow} BTC</Typography>
                  {showFiat && (
                    <div className="currency-conversion">
                      {fiatLoading ? (
                        <CircularProgress size={16} />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <button 
                className="fiat-toggle-button" 
                onClick={onFiatToggle}
              >
                {showFiat ? 'Hide Fiat Values' : 'Show Fiat Values'}
              </button>
            </Box>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}; 