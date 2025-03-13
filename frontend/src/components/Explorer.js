import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Link,
  Paper,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const MEMPOOL_API = 'https://mempool.space/api';

export function Explorer() {
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
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
          // The mempool API returns an array of transactions directly
          const validTransactions = txResponse.data
            .filter(tx => {
              // Check if the transaction has the required properties
              return tx && 
                     typeof tx.vsize === 'number' && 
                     typeof tx.fee === 'number' && 
                     typeof tx.value === 'number';
            })
            .slice(0, 10);
          
          setTransactions(validTransactions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('errors.failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [t]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const formatNumber = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString();
  };

  const formatFeeRate = (fee, vsize) => {
    if (typeof fee !== 'number' || typeof vsize !== 'number') return 'N/A';
    return (fee / vsize).toFixed(1);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('explorer')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('recentBlocks')}
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('height')}</TableCell>
                <TableCell>{t('time')}</TableCell>
                <TableCell>{t('size')}</TableCell>
                <TableCell>{t('transactions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                blocks.map((block) => (
                  <TableRow key={block.height}>
                    <TableCell>
                      <Link 
                        href={`https://mempool.space/block/${block.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {block.height}
                      </Link>
                    </TableCell>
                    <TableCell>{formatTime(block.timestamp)}</TableCell>
                    <TableCell>{formatNumber(block.size)} bytes</TableCell>
                    <TableCell>{formatNumber(block.tx_count)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom>
          {t('recentTransactions')}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('txid')}</TableCell>
                <TableCell>{t('size')}</TableCell>
                <TableCell>{t('feeRate')}</TableCell>
                <TableCell>{t('value')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('noTransactions')}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.txid}>
                    <TableCell>
                      <Link 
                        href={`https://mempool.space/tx/${tx.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}
                      </Link>
                    </TableCell>
                    <TableCell>{formatNumber(tx.vsize)} vB</TableCell>
                    <TableCell>{formatFeeRate(tx.fee, tx.vsize)} sats/vB</TableCell>
                    <TableCell>{formatNumber(tx.value)} sats</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
} 