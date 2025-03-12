import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'https://feeme.onrender.com/api';
const COINLAYER_API_KEY = process.env.REACT_APP_COINLAYER_API_KEY;
const EXCHANGERATES_API_KEY = process.env.REACT_APP_EXCHANGERATES_API_KEY;

// Default transaction size (average Bitcoin transaction is ~250 bytes)
const DEFAULT_TX_SIZE = 250;

// Enhanced Bitcoin logo
const BitcoinLogo = () => (
  <svg className="bitcoin-logo bitcoin-float" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f2a900" d="M63.04 39.74c-4.27 17.14-21.68 27.74-38.82 23.47C7.08 58.94-3.5 41.53.76 24.4 5.04 7.25 22.45-3.34 39.58.93c17.14 4.27 27.73 21.68 23.46 38.81z"/>
    <path fill="#ffffff" d="M46.11 27.44c.64-4.3-2.64-6.62-7.12-8.16l1.46-5.84-3.56-.89-1.42 5.68a37.48 37.48 0 0 0-2.84-.71l1.43-5.72-3.55-.89-1.46 5.84c-.79-.18-1.56-.36-2.3-.55l-4.9-1.22-.94 3.78s2.64.6 2.58.64c1.44.36 1.7 1.3 1.65 2.06l-1.66 6.65c.1.03.23.06.37.12l-.37-.09-2.32 9.3c-.18.44-.62 1.1-1.63.85.04.05-2.58-.64-2.58-.64l-1.76 4.06 4.62 1.15c.86.22 1.7.44 2.53.65l-1.47 5.92 3.55.89 1.46-5.84c.97.26 1.92.5 2.84.73l-1.45 5.82 3.56.89 1.47-5.9c6.06 1.14 10.62.68 12.54-4.8 1.54-4.4-.08-6.94-3.26-8.59 2.33-.54 4.09-2.07 4.55-5.24zm-8.14 11.41c-1.1 4.4-8.52 2.02-10.93 1.42l1.95-7.8c2.4.6 10.11 1.8 8.98 6.38zm1.1-11.42c-1 4-7.16 1.97-9.16 1.47l1.77-7.1c2 .5 8.42 1.43 7.4 5.63z"/>
  </svg>
);

function App() {
  const [transactionSize, setTransactionSize] = useState(DEFAULT_TX_SIZE.toString());
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({
    btcToUsd: null,
    usdToNok: null
  });

  useEffect(() => {
    fetchNetworkStatus();
    fetchExchangeRates();
    // Calculate fees on initial load with default transaction size
    calculateFees();
  }, []);

  const fetchNetworkStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fees`);
      setNetworkStatus(response.data);
    } catch (err) {
      setError('Failed to fetch network status');
    }
  };

  const fetchExchangeRates = async () => {
    try {
      // Fetch BTC to USD rate
      const btcResponse = await axios.get(`https://api.coinlayer.com/live?access_key=${COINLAYER_API_KEY}&target=EUR&symbols=BTC`);
      const btcToUsd = btcResponse.data.rates.BTC;

      // Fetch USD to NOK rate
      const fxResponse = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGERATES_API_KEY}&base=EUR&symbols=NOK`);
      const usdToNok = fxResponse.data.rates.NOK;

      setExchangeRates({
        btcToUsd,
        usdToNok
      });
    } catch (err) {
      setError('Failed to fetch exchange rates');
    }
  };

  const calculateFees = async () => {
    if (!transactionSize) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-fee`, {
        size: parseInt(transactionSize),
      });
      setFees(response.data);
    } catch (err) {
      setError('Failed to calculate fees');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (event) => {
    setTransactionSize(event.target.value);
    if (event.target.value) {
      calculateFees();
    } else {
      setFees(null);
    }
  };

  // Helper function to convert BTC to NOK
  const convertBtcToNok = (btcAmount) => {
    if (!exchangeRates.btcToUsd || !exchangeRates.usdToNok || !btcAmount) return null;
    const usdAmount = btcAmount * exchangeRates.btcToUsd;
    const nokAmount = usdAmount * exchangeRates.usdToNok;
    return nokAmount.toFixed(2);
  };

  return (
    <>
      <div className="bg-pattern"></div>
      <BitcoinLogo />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {/* Enhanced title section */}
          <div className="app-title">
            <Typography variant="h1" component="h1">
              Bitcoin Fee Estimator
            </Typography>
            <Typography className="subtitle">
              Real-time Transaction Cost Calculator
            </Typography>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Card className="glass-card" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Status
              </Typography>
              {networkStatus ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-fast">
                      <Typography className="fee-label">
                        Fast Fee
                      </Typography>
                      <Typography variant="h6" className="fee-value">
                        {networkStatus.fastestFee} sats/vB
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-medium">
                      <Typography className="fee-label">
                        Medium Fee
                      </Typography>
                      <Typography variant="h6" className="fee-value">
                        {networkStatus.halfHourFee} sats/vB
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-slow">
                      <Typography className="fee-label">
                        Slow Fee
                      </Typography>
                      <Typography variant="h6" className="fee-value">
                        {networkStatus.hourFee} sats/vB
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculate Transaction Fee
              </Typography>
              <TextField
                fullWidth
                label="Transaction Size (bytes)"
                type="number"
                value={transactionSize}
                onChange={handleSizeChange}
                helperText="Average Bitcoin transaction is ~250 bytes"
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-fast">
                      <Typography variant="body2" color="text.secondary">
                        Fast (10 min)
                      </Typography>
                      <Typography variant="h6">{fees.fast} BTC</Typography>
                      <div className="currency-conversion">
                        <span className="amount">{convertBtcToNok(fees.fast)}</span>
                        <span className="currency">NOK</span>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-medium">
                      <Typography variant="body2" color="text.secondary">
                        Medium (30 min)
                      </Typography>
                      <Typography variant="h6">{fees.medium} BTC</Typography>
                      <div className="currency-conversion">
                        <span className="amount">{convertBtcToNok(fees.medium)}</span>
                        <span className="currency">NOK</span>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <div className="fee-display fee-slow">
                      <Typography variant="body2" color="text.secondary">
                        Slow (1+ hour)
                      </Typography>
                      <Typography variant="h6">{fees.slow} BTC</Typography>
                      <div className="currency-conversion">
                        <span className="amount">{convertBtcToNok(fees.slow)}</span>
                        <span className="currency">NOK</span>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              ) : null}
            </CardContent>
          </Card>

          <div className="footer">
            <p>Data provided by mempool.space API • Stay Sovereign</p>
          </div>
        </Box>
      </Container>
    </>
  );
}

export default App;