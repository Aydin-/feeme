import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

// Flag icons as SVG components
const UKFlag = () => (
  <svg width="20" height="20" viewBox="0 0 512 512">
    <path fill="#012169" d="M0 0h512v512H0z"/>
    <path fill="#FFF" d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"/>
    <path fill="#C8102E" d="M184 324l11 34L42 512H0v-3l184-185zm124-12l54 8 150 147v45L308 312zM512 0L320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"/>
    <path fill="#FFF" d="M176 0v512h160V0H176zM0 176v160h512V176H0z"/>
    <path fill="#C8102E" d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z"/>
  </svg>
);

const NorwayFlag = () => (
  <svg width="20" height="20" viewBox="0 0 512 512">
    <path fill="#EF2B2D" d="M0 0h512v512H0z"/>
    <path fill="#FFF" d="M128 0h85v512h-85z"/>
    <path fill="#FFF" d="M0 215h512v82H0z"/>
    <path fill="#002868" d="M148 0h45v512h-45z"/>
    <path fill="#002868" d="M0 235h512v42H0z"/>
  </svg>
);

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="English">
        <IconButton 
          onClick={() => setLanguage('en')}
          sx={{ 
            opacity: language === 'en' ? 1 : 0.5,
            transition: 'all 0.2s ease-in-out',
            border: language === 'en' ? '2px solid #f2a900' : '2px solid transparent',
            padding: '4px',
            '&:hover': { 
              opacity: 1,
              backgroundColor: 'rgba(242, 169, 0, 0.1)'
            }
          }}
        >
          <UKFlag />
        </IconButton>
      </Tooltip>
      <Tooltip title="Norsk">
        <IconButton 
          onClick={() => setLanguage('no')}
          sx={{ 
            opacity: language === 'no' ? 1 : 0.5,
            transition: 'all 0.2s ease-in-out',
            border: language === 'no' ? '2px solid #f2a900' : '2px solid transparent',
            padding: '4px',
            '&:hover': { 
              opacity: 1,
              backgroundColor: 'rgba(242, 169, 0, 0.1)'
            }
          }}
        >
          <NorwayFlag />
        </IconButton>
      </Tooltip>
    </Box>
  );
}; 