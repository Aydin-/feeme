import React from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('settings.appearance')}
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              color="primary"
            />
          }
          label={t('settings.darkMode')}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          {t('settings.language')}
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={language === 'no'}
              onChange={() => setLanguage(language === 'en' ? 'no' : 'en')}
              color="primary"
            />
          }
          label={t('settings.norwegian')}
        />
      </Paper>
    </Box>
  );
};

export default Settings; 