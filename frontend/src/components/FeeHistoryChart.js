import React from 'react';
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

const getStepSize = (max) => {
  // Round up max to next unit
  const baseUnit = max <= 5 ? 1 : max <= 10 ? 2 : max <= 20 ? 5 : max <= 50 ? 10 : 20;
  const roundedMax = Math.ceil(max / baseUnit) * baseUnit;
  // Return 1/5 of the scale that will fit the rounded max at 80%
  return Math.ceil(roundedMax / 4);
};

export const FeeHistoryChart = ({ feeHistory }) => {
  const maxFee = Math.max(
    ...feeHistory.fastFees,
    ...feeHistory.mediumFees,
    ...feeHistory.slowFees
  );

  const stepSize = getStepSize(maxFee);
  const yAxisMax = stepSize * 5;

  const chartData = {
    labels: feeHistory.timestamps,
    datasets: [
      {
        label: 'Fast',
        data: feeHistory.fastFees,
        borderColor: 'rgba(0, 200, 83, 1)',
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Medium',
        data: feeHistory.mediumFees,
        borderColor: 'rgba(255, 214, 0, 1)',
        backgroundColor: 'rgba(255, 214, 0, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Slow',
        data: feeHistory.slowFees,
        borderColor: 'rgba(255, 61, 0, 1)',
        backgroundColor: 'rgba(255, 61, 0, 0.1)',
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
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: yAxisMax,
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => value,
          stepSize: stepSize
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'sats/vB',
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      x: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15 // Show 4-minute intervals for better granularity
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}; 