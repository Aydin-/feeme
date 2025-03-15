import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
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
  const { data, loading, error } = useHistoricalFees();
  const { t } = useLanguage();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const chartData = {
    labels: data.map(item => formatTimestamp(item.timestamp)),
    datasets: [
      {
        label: t('medianFee'),
        data: data.map(item => item.medianFee),
        borderColor: '#f2a900',
        backgroundColor: 'rgba(242, 169, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('minFee'),
        data: data.map(item => item.minFee),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('maxFee'),
        data: data.map(item => item.maxFee),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true,
        tension: 0.4,
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
        borderWidth: 1
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
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
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
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          fontSize: '1.25rem',
          mb: 3
        }}>
          {t('historicalFees')}
        </Typography>

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
        ) : (
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 