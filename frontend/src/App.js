import React, { useState, useEffect, useRef } from 'react';
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
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import GaugeChart from 'react-gauge-chart';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = 'https://feeme.onrender.com/api';
const MEMPOOL_API_URL = 'https://mempool.space/api';
const COINLAYER_API_KEY = process.env.REACT_APP_COINLAYER_API_KEY;
const EXCHANGERATES_API_KEY = process.env.REACT_APP_EXCHANGERATES_API_KEY;
const UPDATE_INTERVAL = 15000; // 15 seconds
const HISTORY_POINTS = 60; // 15 minutes (60 points at 15-second intervals)

// Default transaction size (average Bitcoin transaction is ~250 bytes)
const DEFAULT_TX_SIZE = 250;

// Enhanced Bitcoin logo
const BitcoinLogo = () => (
  <svg className="bitcoin-logo bitcoin-float" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f2a900" d="M63.04 39.74c-4.27 17.14-21.68 27.74-38.82 23.47C7.08 58.94-3.5 41.53.76 24.4 5.04 7.25 22.45-3.34 39.58.93c17.14 4.27 27.73 21.68 23.46 38.81z"/>
    <path fill="#ffffff" d="M46.11 27.44c.64-4.3-2.64-6.62-7.12-8.16l1.46-5.84-3.56-.89-1.42 5.68a37.48 37.48 0 0 0-2.84-.71l1.43-5.72-3.55-.89-1.46 5.84c-.79-.18-1.56-.36-2.3-.55l-4.9-1.22-.94 3.78s2.64.6 2.58.64c1.44.36 1.7 1.3 1.65 2.06l-1.66 6.65c.1.03.23.06.37.12l-.37-.09-2.32 9.3c-.18.44-.62 1.1-1.63.85.04.05-2.58-.64-2.58-.64l-1.76 4.06 4.62 1.15c.86.22 1.7.44 2.53.65l-1.47 5.92 3.55.89 1.46-5.84c.97.26 1.92.5 2.84.73l-1.45 5.82 3.56.89 1.47-5.9c6.06 1.14 10.62.68 12.54-4.8 1.54-4.4-.08-6.94-3.26-8.59 2.33-.54 4.09-2.07 4.55-5.24zm-8.14 11.41c-1.1 4.4-8.52 2.02-10.93 1.42l1.95-7.8c2.4.6 10.11 1.8 8.98 6.38zm1.1-11.42c-1 4-7.16 1.97-9.16 1.47l1.77-7.1c2 .5 8.42 1.43 7.4 5.63z"/>
  </svg>
);

// Add these SVG components near the top of the file, after BitcoinLogo
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Add after the existing constants
const WALLET_CONFIGS = {
  electrum: {
    name: "Electrum",
    description: "Desktop wallet with advanced fee controls",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.1, // Electrum adds ~10% margin
      medium: parseFloat(networkFees.medium),
      slow: parseFloat(networkFees.slow) * 0.9 // Electrum allows lower fees for patient users
    })
  },
  bluewallet: {
    name: "BlueWallet",
    description: "Mobile wallet with Lightning support",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.05, // BlueWallet adds ~5% margin
      medium: parseFloat(networkFees.medium) * 1.02,
      slow: parseFloat(networkFees.slow)
    })
  },
  exodus: {
    name: "Exodus",
    description: "User-friendly desktop & mobile wallet",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.15, // Exodus adds higher margins for reliability
      medium: parseFloat(networkFees.medium) * 1.1,
      slow: parseFloat(networkFees.slow) * 1.05
    })
  },
  mempool: {
    name: "Mempool Estimate",
    description: "Direct network fee estimates",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast),
      medium: parseFloat(networkFees.medium),
      slow: parseFloat(networkFees.slow)
    })
  }
};

function App() {
  const [transactionSize, setTransactionSize] = useState(DEFAULT_TX_SIZE.toString());
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [showFiat, setShowFiat] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({
    btcToEur: null,
    eurToNok: null
  });
  const [fiatLoading, setFiatLoading] = useState(false);
  const [feeHistory, setFeeHistory] = useState({
    timestamps: [],
    fastFees: [],
    mediumFees: [],
    slowFees: []
  });
  const [mempoolStats, setMempoolStats] = useState({
    mempoolSize: 0,
    mempoolTxs: 0,
    totalFees: 0,
    medianFee: 0
  });
  const [blockchainInfo, setBlockchainInfo] = useState({
    blocks: 0,
    difficulty: 0,
    progressPercent: 0,
    estimatedRetargetDate: null
  });
  
  const updateTimerRef = useRef(null);

  // Add new state for selected wallet
  const [selectedWallet, setSelectedWallet] = useState('mempool');

  useEffect(() => {
    // Initial fetches for all data
    fetchNetworkStatus();
    calculateFees();
    fetchMempoolStats();
    fetchBlockchainInfo();

    // Set up auto-update interval for network status only
    updateTimerRef.current = setInterval(() => {
      fetchNetworkStatus();
    }, UPDATE_INTERVAL);

    // Set up a separate interval for background updates of mempool and blockchain info
    const backgroundTimer = setInterval(() => {
      fetchMempoolStats().then(() => {
        // Optional: Add any smooth transition logic here
      });
      fetchBlockchainInfo().then(() => {
        // Optional: Add any smooth transition logic here
      });
    }, 120000); // Update every 2 minutes

    // Cleanup
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
      clearInterval(backgroundTimer);
    };
  }, []);

  // Update fee history when new fees are fetched
  useEffect(() => {
    if (networkStatus) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      setFeeHistory(prev => {
        const newTimestamps = [...prev.timestamps, timeStr].slice(-HISTORY_POINTS);
        const newFastFees = [...prev.fastFees, networkStatus.fastestFee].slice(-HISTORY_POINTS);
        const newMediumFees = [...prev.mediumFees, networkStatus.halfHourFee].slice(-HISTORY_POINTS);
        const newSlowFees = [...prev.slowFees, networkStatus.hourFee].slice(-HISTORY_POINTS);

        return {
          timestamps: newTimestamps,
          fastFees: newFastFees,
          mediumFees: newMediumFees,
          slowFees: newSlowFees
        };
      });
    }
  }, [networkStatus]);

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
      setFiatLoading(true);
      // Fetch BTC to EUR rate
      const btcResponse = await axios.get(`https://api.coinlayer.com/live?access_key=${COINLAYER_API_KEY}&target=EUR&symbols=BTC`);
      const btcToEur = btcResponse.data.rates.BTC;

      // Fetch EUR to NOK rate
      const fxResponse = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGERATES_API_KEY}&base=EUR&symbols=NOK`);
      const eurToNok = fxResponse.data.rates.NOK;

      setExchangeRates({
        btcToEur,
        eurToNok
      });
    } catch (err) {
      setError('Failed to fetch exchange rates');
    } finally {
      setFiatLoading(false);
    }
  };

  const calculateFees = async () => {
    if (!transactionSize) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-fee`, {
        size: parseInt(transactionSize),
        wallet: selectedWallet
      });
      
      console.log('Raw API Response:', response.data);
      
      // Validate response data
      if (!response.data || typeof response.data.fast === 'undefined' || 
          typeof response.data.medium === 'undefined' || 
          typeof response.data.slow === 'undefined') {
        console.error('Invalid fee data structure:', response.data);
        throw new Error('Invalid fee data received from API');
      }

      // Convert string values to numbers first
      const networkFees = {
        fast: parseFloat(response.data.fast),
        medium: parseFloat(response.data.medium),
        slow: parseFloat(response.data.slow)
      };

      console.log('Parsed Network Fees:', networkFees);

      // Apply wallet-specific fee calculation with validation
      const walletConfig = WALLET_CONFIGS[selectedWallet];
      if (!walletConfig) {
        throw new Error('Invalid wallet selected');
      }

      const walletFees = walletConfig.feeCalculation(networkFees);
      console.log('Calculated Wallet Fees:', walletFees);

      // Validate calculated fees
      if (isNaN(walletFees.fast) || isNaN(walletFees.medium) || isNaN(walletFees.slow)) {
        console.error('Invalid wallet fees:', walletFees);
        throw new Error('Fee calculation resulted in NaN');
      }

      // Ensure we're working with numbers
      const finalFees = {
        fast: Number(walletFees.fast).toFixed(8),
        medium: Number(walletFees.medium).toFixed(8),
        slow: Number(walletFees.slow).toFixed(8)
      };

      console.log('Final Fees:', finalFees);

      // Additional validation
      if (Object.values(finalFees).some(fee => isNaN(parseFloat(fee)))) {
        throw new Error('Final fee calculation resulted in NaN');
      }

      // Verify that wallet fees are higher than mempool estimates when they should be
      if (selectedWallet !== 'mempool') {
        console.log('Comparing fees with mempool estimates:', {
          fast: {
            wallet: parseFloat(finalFees.fast),
            mempool: parseFloat(networkFees.fast)
          },
          medium: {
            wallet: parseFloat(finalFees.medium),
            mempool: parseFloat(networkFees.medium)
          },
          slow: {
            wallet: parseFloat(finalFees.slow),
            mempool: parseFloat(networkFees.slow)
          }
        });
      }

      setFees(finalFees);
    } catch (err) {
      console.error('Fee calculation error:', err);
      setError(`Failed to calculate fees: ${err.message}`);
      setFees(null);
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

  // Add after handleSizeChange
  const handleWalletChange = (event) => {
    setSelectedWallet(event.target.value);
    if (transactionSize) {
      calculateFees();
    }
  };

  // Helper function to convert BTC to EUR and NOK
  const convertBtcToFiat = (btcAmount) => {
    if (!exchangeRates.btcToEur || !exchangeRates.eurToNok || !btcAmount) return null;
    const eurAmount = btcAmount * exchangeRates.btcToEur;
    const nokAmount = eurAmount * exchangeRates.eurToNok;
    return {
      eur: eurAmount.toFixed(2),
      nok: nokAmount.toFixed(2)
    };
  };

  const handleFiatToggle = async () => {
    const newShowFiat = !showFiat;
    setShowFiat(newShowFiat);
    
    // Only fetch rates when enabling fiat display and rates are not available
    if (newShowFiat && (!exchangeRates.btcToEur || !exchangeRates.eurToNok)) {
      await fetchExchangeRates();
    }
  };

  const fetchMempoolStats = async () => {
    try {
      const mempoolResponse = await axios.get(`${MEMPOOL_API_URL}/mempool`);
      
      // Update state using functional update to ensure smooth transition
      setMempoolStats(prev => ({
        ...prev,
        mempoolSize: mempoolResponse.data.vsize || prev.mempoolSize,
        mempoolTxs: mempoolResponse.data.count || prev.mempoolTxs,
        totalFees: mempoolResponse.data.total_fee || prev.totalFees,
        medianFee: mempoolResponse.data.vsize > 0 ? 
          Math.round((mempoolResponse.data.total_fee / mempoolResponse.data.vsize) * 100) / 100 : prev.medianFee
      }));
    } catch (err) {
      console.error('Failed to fetch mempool stats:', err);
    }
  };

  const fetchBlockchainInfo = async () => {
    try {
      // Fetch latest blocks for height
      const blocksResponse = await axios.get(`${MEMPOOL_API_URL}/v1/blocks/tip/height`);
      
      // Fetch difficulty adjustment info
      const difficultyResponse = await axios.get(`${MEMPOOL_API_URL}/v1/difficulty-adjustment`);
      
      // Update state using functional update to ensure smooth transition
      setBlockchainInfo(prev => ({
        ...prev,
        blocks: blocksResponse.data || prev.blocks,
        difficulty: difficultyResponse.data.difficulty || prev.difficulty,
        progressPercent: difficultyResponse.data.progressPercent || prev.progressPercent,
        estimatedRetargetDate: difficultyResponse.data.estimatedRetargetDate ? 
          new Date(difficultyResponse.data.estimatedRetargetDate).getTime() / 1000 : prev.estimatedRetargetDate
      }));
    } catch (err) {
      console.error('Failed to fetch blockchain info:', err);
    }
  };

  // Chart configuration
  const chartData = {
    labels: feeHistory.timestamps,
    datasets: [
      {
        label: 'Fast',
        data: feeHistory.fastFees,
        borderColor: 'rgba(0, 200, 83, 1)',
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Medium',
        data: feeHistory.mediumFees,
        borderColor: 'rgba(255, 214, 0, 1)',
        backgroundColor: 'rgba(255, 214, 0, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Slow',
        data: feeHistory.slowFees,
        borderColor: 'rgba(255, 61, 0, 1)',
        backgroundColor: 'rgba(255, 61, 0, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Calculate max fee for y-axis scaling
  const maxFee = Math.max(
    ...feeHistory.fastFees,
    ...feeHistory.mediumFees,
    ...feeHistory.slowFees
  );

  // Calculate step size to create 5 rows with max at ~80% of scale
  const getStepSize = (max) => {
    // Round up max to next unit
    const baseUnit = max <= 5 ? 1 : max <= 10 ? 2 : max <= 20 ? 5 : max <= 50 ? 10 : 20;
    const roundedMax = Math.ceil(max / baseUnit) * baseUnit;
    // Return 1/5 of the scale that will fit the rounded max at 80%
    return Math.ceil(roundedMax / 4);
  };

  const stepSize = getStepSize(maxFee);
  // Set max to 5 steps to ensure max fee is at ~80% of scale
  const yAxisMax = stepSize * 5;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      title: {
        display: true,
        text: 'Fee Rate History (Last 15 Minutes)',
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    scales: {
      y: {
        min: 0,
        max: yAxisMax,
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => value,
          stepSize: stepSize
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'sats/vB',
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const formatHashrate = (hashrate) => {
    const sizes = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
    if (hashrate === 0) return '0 H/s';
    const i = parseInt(Math.floor(Math.log(hashrate) / Math.log(1000)));
    return Math.round(hashrate / Math.pow(1000, i), 2) + ' ' + sizes[i];
  };

  // Add wallet description text based on selected wallet
  const getWalletAdjustmentText = (wallet) => {
    switch(wallet) {
      case 'electrum':
        return "Electrum adds 10% to fast fees and reduces slow fees by 10% for patient users";
      case 'bluewallet':
        return "BlueWallet adds 5% to fast fees and 2% to medium fees";
      case 'exodus':
        return "Exodus adds 15% to fast fees, 10% to medium fees, and 5% to slow fees for higher reliability";
      case 'mempool':
        return "Direct network fee estimates without adjustments";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="bg-pattern"></div>
      <BitcoinLogo />
      <Container maxWidth="lg">
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

          {/* Network Status Card */}
          <Card className="glass-card" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Status
              </Typography>
              {networkStatus ? (
                <>
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
                  <Box sx={{ height: '300px', mt: 4 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Mempool Statistics Card */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mempool Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div className="stat-display">
                        <Typography className="stat-label">
                          Mempool Size
                        </Typography>
                        <Typography variant="h6" className="stat-value">
                          {formatBytes(mempoolStats.mempoolSize)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="stat-display">
                        <Typography className="stat-label">
                          Pending Transactions
                        </Typography>
                        <Typography variant="h6" className="stat-value">
                          {formatNumber(mempoolStats.mempoolTxs)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Mempool Capacity
                        </Typography>
                        <GaugeChart
                          id="mempool-gauge"
                          nrOfLevels={20}
                          percent={Math.min(mempoolStats.mempoolSize / (300 * 1024 * 1024), 1)} // 300MB max
                          colors={['#00C853', '#FFD600', '#FF3D00']}
                          textColor="#ffffff"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Blockchain Info
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div className="stat-display">
                        <Typography className="stat-label">
                          Block Height
                        </Typography>
                        <Typography variant="h6" className="stat-value">
                          {formatNumber(blockchainInfo.blocks)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="stat-display">
                        <Typography className="stat-label">
                          Difficulty Adjustment
                        </Typography>
                        <Typography variant="h6" className="stat-value">
                          {blockchainInfo.progressPercent?.toFixed(2)}%
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Difficulty Adjustment Progress
                        </Typography>
                        <GaugeChart
                          id="difficulty-gauge"
                          nrOfLevels={20}
                          percent={blockchainInfo.progressPercent ? blockchainInfo.progressPercent / 100 : 0}
                          colors={['#f2a900']}
                          textColor="#ffffff"
                        />
                        {blockchainInfo.estimatedRetargetDate && (
                          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            Estimated adjustment: {new Date(blockchainInfo.estimatedRetargetDate * 1000).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculate Transaction Fee
              </Typography>
              
              {/* Add wallet selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Wallet
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(WALLET_CONFIGS).map(([key, wallet]) => (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                      <Card 
                        className={`wallet-card ${selectedWallet === key ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedWallet(key);
                          if (transactionSize) calculateFees();
                        }}
                        sx={{
                          cursor: 'pointer',
                          p: 2,
                          bgcolor: selectedWallet === key ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        <Typography variant="subtitle1">{wallet.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {wallet.description}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {/* Add wallet adjustment explanation */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  {getWalletAdjustmentText(selectedWallet)}
                </Typography>
              </Box>

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
                      onClick={handleFiatToggle}
                    >
                      {showFiat ? 'Hide Fiat Values' : 'Show Fiat Values'}
                    </button>
                  </Box>
                </>
              ) : null}
            </CardContent>
          </Card>

          <div className="footer">
            <p>Data provided by mempool.space API • Stay Sovereign</p>
            <div className="social-links">
              <a 
                href="https://github.com/Aydin-" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/aydingungordu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
}

export default App;