import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useHashrateHistory } from '../hooks/useHashrateHistory';
import { formatHashrate } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export const HashratePower = () => {
  const [timespan, setTimespan] = useState('3y');
  const { timestamps, hashrates, loading, error } = useHashrateHistory(timespan);
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  // Calculate min and max for y-axis with safety checks
  const validHashrates = hashrates.filter(h => typeof h === 'number' && !isNaN(h));
  const minHashrate = validHashrates.length > 0 ? Math.min(...validHashrates) : 0;
  const maxHashrate = validHashrates.length > 0 ? Math.max(...validHashrates) : 100;
  const yAxisMin = Math.max(0, Math.floor(minHashrate * 0.95)); // Ensure non-negative
  const yAxisMax = Math.ceil(maxHashrate * 1.05);

  const chartData = {
    datasets: [
      {
        label: t('hashrate'),
        data: timestamps.map((timestamp, index) => ({
          x: new Date(timestamp).getTime(),
          y: hashrates[index]
        })).filter(point => !isNaN(point.y)),
        borderColor: '#f2a900',
        backgroundColor: 'rgba(242, 169, 0, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => {
            if (!context || !context[0] || !context[0].raw || !context[0].raw.x) return '';
            const date = new Date(context[0].raw.x);
            if (isNaN(date.getTime())) return '';
            
            if (timespan === '1w') {
              return date.toLocaleDateString(undefined, { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              });
            } else if (timespan === '1m' || timespan === '3m') {
              return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            } else {
              // For 1y and 3y
              return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long'
              });
            }
          },
          label: (context) => {
            if (!context || !context.raw || typeof context.raw.y !== 'number') return '';
            return `${t('hashrate')}: ${context.raw.y.toFixed(2)} EH/s`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timespan === '1w' ? 'day' :
                timespan === '1m' ? 'week' :
                timespan === '3m' ? 'month' :
                timespan === '1y' ? 'quarter' :
                timespan === 'all' ? 'year' : 'quarter',
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy',
            quarter: 'MMM yyyy',
            year: 'yyyy'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          source: 'auto',
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit: timespan === 'all' ? 10 : undefined
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: yAxisMax,
        title: {
          display: true,
          text: 'Network Hashrate (EH/s)',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: (value) => value.toFixed(0)
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