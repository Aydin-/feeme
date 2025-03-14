import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert, Grid, CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import { NetworkStatus } from './components/NetworkStatus';
import { MempoolStats } from './components/MempoolStats';
import { BlockchainInfo } from './components/BlockchainInfo';
import { FeeCalculator } from './components/FeeCalculator';
import { HashratePower } from './components/HashratePower';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Premium } from './components/Premium';
import { Inspiration } from './components/Inspiration';
import { Contribute } from './components/Contribute';
import { About } from './components/About';
import { Explorer } from './components/Explorer';
import { HistoricalFees } from './components/HistoricalFees';
import { ApiDocs } from './components/ApiDocs';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useMempoolStats } from './hooks/useMempoolStats';
import { useBlockchainInfo } from './hooks/useBlockchainInfo';
import { DEFAULT_TX_SIZE, API_BASE_URL, HISTORY_POINTS } from './config/constants';
import { WALLET_CONFIGS } from './config/walletConfigs';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import PriceHistory from './components/PriceHistory';
import { Navigation } from './components/Navigation';
import Portfolio from './components/Portfolio';
import { Web3ContextProvider } from './contexts/Web3Context';
import './styles/bootstrap-theme.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('fees');
  const [transactionSize, setTransactionSize] = useState(DEFAULT_TX_SIZE);
  const [selectedWallet, setSelectedWallet] = useState('mempool');
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFiat, setShowFiat] = useState(false);
  const [fiatLoading, setFiatLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const { isDarkMode } = useTheme();
  const [feeHistory, setFeeHistory] = useState({
    timestamps: [],
    fastFees: [],
    mediumFees: [],
    slowFees: []
  });

  const { networkStatus } = useNetworkStatus();
  const mempoolStats = useMempoolStats();
  const blockchainInfo = useBlockchainInfo();

  // Update fee history when new fees are fetched
  useEffect(() => {
    if (networkStatus) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      setFeeHistory(prev => {
        // Store data points for 1 hour at 15-second intervals
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

  const calculateFees = async () => {
    if (!transactionSize) return;

    setLoading(true);
    setFees(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-fee`, {
        size: parseInt(transactionSize),
        wallet: selectedWallet
      });
      
      console.log('Raw API Response:', response.data);
      
      if (!response.data || typeof response.data.fast === 'undefined' || 
          typeof response.data.medium === 'undefined' || 
          typeof response.data.slow === 'undefined') {
        throw new Error('Invalid fee data received from API');
      }

      const networkFees = {
        fast: parseFloat(response.data.fast),
        medium: parseFloat(response.data.medium),
        slow: parseFloat(response.data.slow)
      };

      const walletConfig = WALLET_CONFIGS[selectedWallet];
      if (!walletConfig) {
        throw new Error('Invalid wallet selected');
      }

      const walletFees = walletConfig.feeCalculation(networkFees);
      
      if (isNaN(walletFees.fast) || isNaN(walletFees.medium) || isNaN(walletFees.slow)) {
        throw new Error('Fee calculation resulted in NaN');
      }

      const finalFees = {
        fast: Number(walletFees.fast).toFixed(8),
        medium: Number(walletFees.medium).toFixed(8),
        slow: Number(walletFees.slow).toFixed(8)
      };

      setFees(finalFees);
    } catch (err) {
      console.error('Fee calculation error:', err);
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

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    if (transactionSize) {
      calculateFees();
    }
  };

  const convertBtcToFiat = (btcAmount) => {
    if (!exchangeRates || !btcAmount) return null;
    const eurAmount = btcAmount * exchangeRates.btcToEur;
    const nokAmount = eurAmount * exchangeRates.eurToNok;
    return {
      eur: eurAmount.toFixed(2),
      nok: nokAmount.toFixed(2)
    };
  };

  const fetchExchangeRates = async () => {
    try {
      setFiatLoading(true);
      // For demo purposes, using hardcoded exchange rates
      // In production, you would fetch these from actual API endpoints
      setExchangeRates({
        btcToEur: 51234.56, // Example rate
        eurToNok: 11.42 // Example rate
      });
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
    } finally {
      setFiatLoading(false);
    }
  };

  const handleFiatToggle = async () => {
    const newShowFiat = !showFiat;
    setShowFiat(newShowFiat);
    
    if (newShowFiat && (!exchangeRates || !exchangeRates.btcToEur || !exchangeRates.eurToNok)) {
      await fetchExchangeRates();
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#f2a900',
      },
      background: {
        default: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        paper: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#333333',
        secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#ffffff' : '#333333',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="bg-pattern" style={{ 
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        transition: 'background-color 0.3s ease'
      }}></div>
      <Header />
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { 
            xs: 2,
            sm: 3,
            md: 4,
            lg: 6,
            xl: 8
          }
        }}
      >
        <Box sx={{ 
          maxWidth: '2000px',
          mx: 'auto',
          display: 'flex',
          gap: 4,
          width: '100%',
          position: 'relative'
        }}>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          <Box sx={{ 
            flex: 1,
            minWidth: 0, // This prevents flex items from overflowing
            mt: { xs: 8, md: 0 } // Add top margin on mobile to account for the menu button
          }}>
            {currentPage === 'fees' ? (
              <>
                <FeeCalculator
                  transactionSize={transactionSize}
                  onSizeChange={handleSizeChange}
                  selectedWallet={selectedWallet}
                  onWalletSelect={handleWalletSelect}
                  fees={fees}
                  loading={loading}
                  showFiat={showFiat}
                  onFiatToggle={handleFiatToggle}
                  fiatLoading={fiatLoading}
                  convertBtcToFiat={convertBtcToFiat}
                />

                <Grid container spacing={4} sx={{ mt: 4, mb: 4 }}>
                  <Grid item xs={12}>
                    <NetworkStatus 
                      networkStatus={networkStatus}
                      feeHistory={feeHistory}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <HistoricalFees />
                  </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <HashratePower />
                  </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <MempoolStats mempoolStats={mempoolStats} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <BlockchainInfo blockchainInfo={blockchainInfo} />
                  </Grid>
                </Grid>
              </>
            ) : currentPage === 'portfolio' ? (
              <Portfolio />
            ) : currentPage === 'premium' ? (
              <Premium />
            ) : currentPage === 'inspiration' ? (
              <Inspiration />
            ) : currentPage === 'contribute' ? (
              <Contribute />
            ) : currentPage === 'about' ? (
              <About />
            ) : currentPage === 'explorer' ? (
              <Explorer />
            ) : currentPage === 'api-docs' ? (
              <ApiDocs />
            ) : (
              <PriceHistory />
            )}

            <Footer />
          </Box>
        </Box>
      </Container>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Web3ContextProvider>
          <AppContent />
        </Web3ContextProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;