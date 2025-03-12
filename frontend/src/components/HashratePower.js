import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useHashrateHistory } from '../hooks/useHashrateHistory';
import { formatHashrate } from '../utils/formatters';

const timeOptions = [
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
  { value: '5y', label: '5 Years' },
  { value: 'all', label: 'All Time' }
];

export const HashratePower = () => {
  const [timespan, setTimespan] = useState('1m');
  const { timestamps, hashrates, loading, error } = useHashrateHistory(timespan);

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  const chartData = {
    labels: timestamps.map(t => t.toLocaleDateString()),
    datasets: [
      {
        label: 'Network Hashrate',
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
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      title: {
        display: true,
        text: 'Bitcoin Network Hashrate History',
        color: 'rgba(255, 255, 255, 0.8)'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Hashrate: ${formatHashrate(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => formatHashrate(value)
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timespan === '1w' ? 7 : 
                        timespan === '1m' ? 8 : 
                        timespan === '3m' ? 12 : 
                        timespan === '1y' || timespan === '5y' || timespan === 'all' ? 12 : 8,
          callback: (value, index, values) => {
            const date = new Date(timestamps[index]);
            if (timespan === '1w') {
              return date.toLocaleDateString(undefined, { weekday: 'short' });
            } else if (timespan === '1m') {
              return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            } else if (timespan === '3m') {
              return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            } else {
              return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
            }
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    elements: {
      point: {
        radius: timespan === '1w' ? 3 : 
                timespan === '1m' ? 2 : 
                timespan === '3m' ? 1 : 0,
        hitRadius: 10,
        hoverRadius: 5
      },
      line: {
        tension: 0.4,
        borderWidth: timespan === '1w' ? 2 : 
                    timespan === '1m' ? 1.5 : 1
      }
    }
  };

  return (
    <Card className="glass-card" sx={{ height: '100%', mb: { xs: 4, md: 0 } }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Network Hashrate</Typography>
          <ToggleButtonGroup
            value={timespan}
            exclusive
            onChange={handleTimespanChange}
            size="small"
          >
            {timeOptions.map(option => (
              <ToggleButton 
                key={option.value} 
                value={option.value}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(242, 169, 0, 0.2)',
                    color: '#f2a900'
                  }
                }}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', py: 3 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 