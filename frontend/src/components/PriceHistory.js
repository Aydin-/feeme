import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { formatPrice, formatDate } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistory = () => {
  const { t } = useTranslation();
  const [timespan, setTimespan] = useState('1y');
  const { timestamps, prices, loading, error } = usePriceHistory(timespan);

  const handleTimespanChange = (event, newTimespan) => {
    if (newTimespan !== null) {
      setTimespan(newTimespan);
    }
  };

  const chartData = useMemo(() => {
    if (!timestamps.length || !prices.length) return null;

    const formatLabel = (timestamp) => {
      const date = new Date(timestamp);
      switch (timespan) {
        case '1w':
          return formatDate(date, 'HH:mm');
        case '1m':
          return formatDate(date, 'MMM D');
        case '3m':
          return formatDate(date, 'MMM D');
        case '1y':
          return formatDate(date, 'MMM YYYY');
        case '3y':
          return formatDate(date, 'MMM YYYY');
        case 'all':
          return formatDate(date, 'YYYY');
        default:
          return formatDate(date, 'MMM D');
      }
    };

    return {
      labels: timestamps.map(formatLabel),
      datasets: [
        {
          label: t('price.bitcoinPrice'),
          data: prices,
          fill: false,
          borderColor: '#f7931a',
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };
  }, [timestamps, prices, timespan, t]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            if (context[0]) {
              const date = new Date(timestamps[context[0].dataIndex]);
              switch (timespan) {
                case '1w':
                  return formatDate(date, 'MMM D, YYYY HH:mm');
                case '1m':
                case '3m':
                  return formatDate(date, 'MMM D, YYYY');
                case '1y':
                case '3y':
                case 'all':
                  return formatDate(date, 'MMM YYYY');
                default:
                  return formatDate(date, 'MMM D, YYYY');
              }
            }
            return '';
          },
          label: (context) => {
            return `${t('price.bitcoinPrice')}: $${formatPrice(context.raw)}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: timespan === '1w' ? 6 : timespan === '1m' ? 10 : 8,
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value) => `$${formatPrice(value)}`,
        },
      },
    },
  }), [timespan, timestamps, t]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {t('price.bitcoinPriceHistory')}
          </Typography>
          <ToggleButtonGroup
            value={timespan}
            exclusive
            onChange={handleTimespanChange}
            size="small"
          >
            <ToggleButton value="1w">{t('timeOptions.1w')}</ToggleButton>
            <ToggleButton value="1m">{t('timeOptions.1m')}</ToggleButton>
            <ToggleButton value="3m">{t('timeOptions.3m')}</ToggleButton>
            <ToggleButton value="1y">{t('timeOptions.1y')}</ToggleButton>
            <ToggleButton value="3y">{t('timeOptions.3y')}</ToggleButton>
            <ToggleButton value="all">{t('timeOptions.all')}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Box height={400}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>{t('loading')}</Typography>
            </Box>
          )}
          
          {error && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          
          {!loading && !error && chartData && (
            <Line data={chartData} options={chartOptions} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PriceHistory; 