import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export const AnimatedGauge = ({ value, maxValue, label, color, unit = '%', size = 320 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / maxValue) * 100;
  const radius = size * 0.42;
  const strokeWidth = size * 0.03;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (percent) => {
    if (color) return color;
    if (percent <= 33) return '#00C853';
    if (percent <= 66) return '#FFD600';
    return '#FF3D00';
  };

  const formatValue = (val) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(2)}`;
    return val.toFixed(2);
  };

  const formatUnit = (val) => {
    if (val >= 1e9) return 'GB';
    if (val >= 1e6) return 'MB';
    if (val >= 1e3) return 'KB';
    return unit;
  };

  const currentColor = getColor(percentage);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: size + 48,
      height: size + 48,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      my: 4
    }}>
      <svg
        height={size + 48}
        width={size + 48}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <g transform={`translate(24, 24)`}>
          {/* Outer glow effect */}
          <circle
            stroke={currentColor}
            fill="transparent"
            strokeWidth={1}
            r={normalizedRadius + strokeWidth * 3}
            cx={size / 2}
            cy={size / 2}
            style={{
              filter: 'blur(12px)',
              opacity: 0.2
            }}
          />
          
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.12)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0.05)' }} />
            </linearGradient>
          </defs>
          <circle
            stroke="url(#backgroundGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id={`progressGradient-${currentColor}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: currentColor }} />
              <stop offset="100%" style={{ stopColor: `${currentColor}CC` }} />
            </linearGradient>
          </defs>
          <circle
            stroke={`url(#progressGradient-${currentColor})`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease-in-out',
              filter: `drop-shadow(0 0 6px ${currentColor})`
            }}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Multiple pulse effects for more dynamic animation */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              stroke={currentColor}
              fill="transparent"
              strokeWidth={strokeWidth / 4}
              r={normalizedRadius}
              cx={size / 2}
              cy={size / 2}
              opacity="0.15"
              style={{
                animation: `pulse ${2 + i * 0.5}s ease-out infinite ${i * 0.5}s`
              }}
            />
          ))}

          {/* Tick marks for scale reference */}
          {[...Array(12)].map((_, i) => {
            const rotation = (i * 360) / 12;
            const tickLength = i % 3 === 0 ? strokeWidth * 2 : strokeWidth;
            return (
              <line
                key={i}
                x1={size / 2}
                y1={strokeWidth}
                x2={size / 2}
                y2={strokeWidth + tickLength}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={i % 3 === 0 ? 2 : 1}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              />
            );
          })}
        </g>
      </svg>
      
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          top: 0,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: currentColor,
            textShadow: `0 0 15px ${currentColor}40`,
            animation: 'fadeIn 0.5s ease-out',
            letterSpacing: '-0.05em',
            fontSize: '2.5rem'
          }}
        >
          {formatValue(animatedValue)}
          <Typography
            component="span"
            variant="h6"
            sx={{
              ml: 1,
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 'normal'
            }}
          >
            {formatUnit(animatedValue)}
          </Typography>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 2,
            fontWeight: 500,
            fontSize: '0.95rem',
            letterSpacing: '0.02em'
          }}
        >
          {label}
        </Typography>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.15;
            }
            50% {
              transform: scale(1.015);
              opacity: 0.1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </Box>
  );
}; 