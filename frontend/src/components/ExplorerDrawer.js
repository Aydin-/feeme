import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Link,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const MEMPOOL_API = 'https://mempool.space/api';

export const ExplorerDrawer = ({ open, onClose }) => {
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [blocksResponse, txResponse] = await Promise.all([
          axios.get(`${MEMPOOL_API}/v1/blocks`, {
            headers: {
              'Accept': 'application/json',
            }
          }),
          axios.get(`${MEMPOOL_API}/mempool/recent`, {
            headers: {
              'Accept': 'application/json',
            }
          })
        ]);

        if (blocksResponse.data) {
          setBlocks(blocksResponse.data.slice(0, 10));
        }
        if (txResponse.data) {
          setTransactions(txResponse.data.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('errors.failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [open]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const formatBytes = (bytes) => {
    return (bytes / 1000000).toFixed(2) + ' MB';
  };

  const formatSats = (sats) => {
    return (sats / 100000000).toFixed(8) + ' BTC';
  };

  const formatFeeRate = (fee, vsize) => {
    return (fee / vsize).toFixed(1);
  };

  return (
    <>
      {/* Backdrop */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1200,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <Paper
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '75%',
          maxWidth: '1000px',
          height: '100vh',
          bgcolor: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ 
          p: 3,
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(18, 18, 18, 0.9)',
        }}>
          <Typography variant="h5" sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 500
          }}>
            {t('explorer')}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#f2a900',
                bgcolor: 'rgba(242, 169, 0, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(18, 18, 18, 0.9)',
            backdropFilter: 'blur(10px)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              py: 2,
              '&.Mui-selected': {
                color: '#f2a900',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#f2a900',
              height: 3,
            },
          }}
        >
          <Tab label={t('recentBlocks')} />
          <Tab label={t('recentTransactions')} />
        </Tabs>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress sx={{ color: '#f2a900' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ 
              bgcolor: 'rgba(211, 47, 47, 0.1)', 
              color: '#ff5252',
              '& .MuiAlert-icon': { color: '#ff5252' }
            }}>
              {error}
            </Alert>
          ) : activeTab === 0 ? (
            <TableContainer sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('height')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('time')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('size')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('transactions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blocks.map((block) => (
                    <TableRow key={block.height} hover sx={{ 
                      '&:hover': { 
                        bgcolor: 'rgba(242, 169, 0, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }
                    }}>
                      <TableCell sx={{ 
                        fontSize: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <Link 
                          href={`https://mempool.space/block/${block.id}`}
                          target="_blank"
                          sx={{ 
                            color: '#f2a900',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {block.height}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{formatTime(block.timestamp)}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{formatBytes(block.size)}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{block.tx_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('time')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('size')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('feeRate')}</TableCell>
                    <TableCell width="25%" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t('value')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.txid} hover sx={{ 
                      '&:hover': { 
                        bgcolor: 'rgba(242, 169, 0, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }
                    }}>
                      <TableCell sx={{ 
                        fontSize: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <Link 
                          href={`https://mempool.space/tx/${tx.txid}`}
                          target="_blank"
                          sx={{ 
                            color: '#f2a900',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {tx.txid.substring(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {formatFeeRate(tx.fee, tx.vsize)} sat/vB
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{formatSats(tx.value)}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{tx.vsize} bytes</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Data provided by{' '}
            <Link 
              href="https://mempool.space"
              target="_blank"
              sx={{ 
                color: '#f2a900',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              mempool.space
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
            Designed and developed by AydinTech
          </Typography>
        </Box>
      </Paper>
    </>
  );
}; 