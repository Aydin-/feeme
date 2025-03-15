import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
import { useHistoricalFees } from '../hooks/useHistoricalFees';
import { useLanguage } from '../contexts/LanguageContext';

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

export const HistoricalFees = () => {
  const [timespan, setTimespan] = useState('24h');
  const { data, loading, error } = useHistoricalFees(timespan);
  const { t } = useLanguage();

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    switch (timespan) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '3d':
      case '1w':
        return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', hour: '2-digit' });
      case '1m':
      case '3m':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1y':
        return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
      default:
        return date.toLocaleTimeString();
    }
  };

  const chartData = {
    labels: data.map(item => formatTimestamp(item.timestamp)),
    datasets: [
      {
        label: t('fastFee'),
        data: data.map(item => item.fastFee),
        borderColor: 'rgba(0, 200, 83, 1)',
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: t('medianFee'),
        data: data.map(item => item.medianFee),
        borderColor: 'rgba(255, 214, 0, 1)',
        backgroundColor: 'rgba(255, 214, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: t('slowFee'),
        data: data.map(item => item.slowFee),
        borderColor: 'rgba(255, 61, 0, 1)',
        backgroundColor: 'rgba(255, 61, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            if (context[0]) {
              const date = new Date(data[context[0].dataIndex].timestamp * 1000);
              return date.toLocaleString();
            }
            return '';
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.raw} sats/vB`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: timespan === '24h' ? 12 : timespan === '3d' ? 9 : 8
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value) => `${value} sats/vB`
        },
        title: {
          display: true,
          text: 'sats/vB',
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  return (
    <Card className="glass-card">
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            {t('historicalFees')}
          </Typography>

          <ToggleButtonGroup
            value={timespan}
            exclusive
            onChange={handleTimespanChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                '&.Mui-selected': {
                  color: '#f2a900',
                  backgroundColor: 'rgba(242, 169, 0, 0.1)',
                }
              }
            }}
          >
            <ToggleButton value="24h">{t('timeOptions.24h')}</ToggleButton>
            <ToggleButton value="3d">{t('timeOptions.3d')}</ToggleButton>
            <ToggleButton value="1w">{t('timeOptions.1w')}</ToggleButton>
            <ToggleButton value="1m">{t('timeOptions.1m')}</ToggleButton>
            <ToggleButton value="3m">{t('timeOptions.3m')}</ToggleButton>
            <ToggleButton value="1y">{t('timeOptions.1y')}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ 
            bgcolor: 'rgba(211, 47, 47, 0.1)', 
            color: '#ff5252',
            '& .MuiAlert-icon': { color: '#ff5252' }
          }}>
            {error}
          </Alert>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} sx={{ color: '#f2a900' }} />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <Typography color="text.secondary">
              {t('noDataAvailable')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 