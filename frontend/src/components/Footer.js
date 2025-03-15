import React from 'react';
import { GithubIcon, LinkedInIcon } from '../icons';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <div className="footer glassy-footer">
      <div className="footer-content">
        <p>{t('designedBy')} • {t('dataProvided')} mempool.space API • {t('stayingSovereign')}</p>
        <div className="social-links">
          <a 
            href="https://github.com/Aydin-/feeme" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/aydingungordu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}; 