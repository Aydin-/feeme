import React from 'react';
import { GithubIcon, LinkedInIcon } from '../icons';

export const Footer = () => {
  return (
    <div className="footer">
      <p>Designed and developed by Aydin Gungordu • Data provided by mempool.space API • Stay Sovereign</p>
      <div className="social-links">
        <a 
          href="https://github.com/Aydin-" 
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
  );
}; 