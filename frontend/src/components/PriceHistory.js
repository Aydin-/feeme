import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePriceHistory } from '../hooks/usePriceHistory';

export const PriceHistory = () => {
  const [timespan, setTimespan] = useState('365d');
  const { timestamps, prices, loading, error } = usePriceHistory(timespan);
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  const chartData = {
    labels: timestamps.map(t => t.toLocaleDateString()),
    datasets: [
      {
        label: t('BTC Price'),
        data: prices,
        borderColor: '#f2a900',
        backgroundColor: 'rgba(242, 169, 0, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#f2a900',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHoverHitRadius: 10,
        shadowColor: 'rgba(242, 169, 0, 0.3)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.raw.toLocaleString()}`;
          }
        },
        boxPadding: 6,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          },
          padding: 8,
          maxTicksLimit: timespan === '1d' ? 12 : 8,
          callback: function(value, index, values) {
            if (timespan === '1d') {
              return new Date(timestamps[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return new Date(timestamps[index]).toLocaleDateString();
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: value => `$${value.toLocaleString()}`,
          font: {
            size: 11
          },
          padding: 8,
          maxTicksLimit: 6
        }
      }
    }
  };

  return (
    <Card className="glass-card" sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            {t('BTC Price')}
          </Typography>
          <ToggleButtonGroup
            value={timespan}
            exclusive
            onChange={handleTimespanChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                '&.Mui-selected': {
                  color: '#f2a900',
                  backgroundColor: 'rgba(242, 169, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(242, 169, 0, 0.2)',
                },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                },
              },
            }}
          >
            {Object.entries(t('timeOptions')).map(([value, label]) => (
              <ToggleButton key={value} value={value}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative', height: '500px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={32} sx={{ color: '#f2a900' }} />
              <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 3 }}>
              {t('errors.dataNotAvailable')}
            </Typography>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 