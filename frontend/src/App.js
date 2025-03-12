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

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [transactionSize, setTransactionSize] = useState('');
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(null);

  useEffect(() => {
    fetchNetworkStatus();
  }, []);

  const fetchNetworkStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fees`);
      setNetworkStatus(response.data);
    } catch (err) {
      setError('Failed to fetch network status');
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
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Bitcoin Fee Estimator
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Network Status
            </Typography>
            {networkStatus ? (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Fast Fee
                  </Typography>
                  <Typography variant="h6">
                    {networkStatus.fastestFee} sats/vB
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Medium Fee
                  </Typography>
                  <Typography variant="h6">
                    {networkStatus.halfHourFee} sats/vB
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Slow Fee
                  </Typography>
                  <Typography variant="h6">
                    {networkStatus.hourFee} sats/vB
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <CircularProgress size={24} />
            )}
          </CardContent>
        </Card>

        <Card>
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
              sx={{ mb: 2 }}
            />

            {loading ? (
              <CircularProgress />
            ) : fees ? (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Fast (10 min)
                  </Typography>
                  <Typography variant="h6">{fees.fast} BTC</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Medium (30 min)
                  </Typography>
                  <Typography variant="h6">{fees.medium} BTC</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Slow (1+ hour)
                  </Typography>
                  <Typography variant="h6">{fees.slow} BTC</Typography>
                </Grid>
              </Grid>
            ) : null}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default App; 