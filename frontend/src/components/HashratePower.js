import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useHashrateHistory } from '../hooks/useHashrateHistory';
import { formatHashrate } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const HashratePower = () => {
  const [timespan, setTimespan] = useState('1m');
  const { timestamps, hashrates, loading, error } = useHashrateHistory(timespan);
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  // Calculate min and max for y-axis
  const minHashrate = Math.min(...hashrates);
  const maxHashrate = Math.max(...hashrates);
  const yAxisMin = Math.floor(minHashrate * 0.95); // 5% below min
  const yAxisMax = Math.ceil(maxHashrate * 1.05); // 5% above max

  const chartData = {
    labels: timestamps.map(t => t.toLocaleDateString()),
    datasets: [
      {
        label: t('networkHashrate'),
        data: hashrates,
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
            return formatHashrate(context.raw);
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
          padding: 8
        }
      },
      y: {
        min: yAxisMin,
        max: yAxisMax,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: value => formatHashrate(value),
          font: {
            size: 11
          },
          padding: 8
        }
      }
    }
  };

  return (
    <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #f2a900 30%, #ff8e3c 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            {t('networkHashrate')}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress size={32} sx={{ color: '#f2a900' }} />
            <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', py: 3 }}>
            {t('errors.failedToFetchHashrate')}
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 