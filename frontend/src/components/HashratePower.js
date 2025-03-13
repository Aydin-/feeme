import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useHashrateHistory } from '../hooks/useHashrateHistory';
import { formatHashrate } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

export const HashratePower = () => {
  const [timespan, setTimespan] = useState('1m');
  const { timestamps, hashrates, loading, error } = useHashrateHistory(timespan);
  const { t } = useLanguage();

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  const chartData = {
    labels: timestamps.map(t => t.toLocaleDateString()),
    datasets: [
      {
        label: t('networkHashrate'),
        data: hashrates,
        borderColor: '#f2a900',
        backgroundColor: 'rgba(242, 169, 0, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: value => formatHashrate(value)
        }
      }
    }
  };

  return (
    <Card className="glass-card">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {t('networkHashrate')}
          </Typography>
          <ToggleButtonGroup
            value={timespan}
            exclusive
            onChange={handleTimespanChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&.Mui-selected': {
                  color: '#f2a900',
                  backgroundColor: 'rgba(242, 169, 0, 0.1)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
            <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', py: 3 }}>
            {t('errors.failedToFetchHashrate')}
          </Typography>
        ) : (
          <Box sx={{ height: 300 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 