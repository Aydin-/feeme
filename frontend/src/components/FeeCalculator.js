import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, IconButton, InputBase, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Calculate Transaction Fee
        </Typography>
        
        <WalletSelector 
          selectedWallet={selectedWallet}
          onWalletSelect={onWalletSelect}
        />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            Transaction Size (bytes)
          </Typography>
          
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 'auto',
              maxWidth: '280px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              p: '2px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <IconButton 
              onClick={handleDecrement}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#f2a900',
                  bgcolor: 'rgba(242, 169, 0, 0.1)'
                },
                transition: 'all 0.2s'
              }}
            >
              <RemoveIcon />
            </IconButton>
            
            <InputBase
              value={transactionSize}
              onChange={handleInputChange}
              inputProps={{
                min: 0,
                style: { 
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.9)',
                  width: '80px',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }
              }}
              sx={{
                mx: 1,
                '& input': {
                  p: '4px 0'
                }
              }}
            />
            
            <IconButton 
              onClick={handleIncrement}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: '#f2a900',
                  bgcolor: 'rgba(242, 169, 0, 0.1)'
                },
                transition: 'all 0.2s'
              }}
            >
              <AddIcon />
            </IconButton>
          </Paper>
          
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1,
              color: 'rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic'
            }}
          >
            Average Bitcoin transaction is ~{DEFAULT_TX_SIZE} bytes
          </Typography>
        </Box>

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