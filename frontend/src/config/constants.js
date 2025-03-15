// Determine API base URL based on environment
const APP_ENV = process.env.REACT_APP_ENV;
export const API_BASE_URL = APP_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://feeme.onrender.com/api';

// Use our backend API for mempool space data
export const MEMPOOL_API_URL = API_BASE_URL;
export const UPDATE_INTERVAL = 15000; // 15 seconds
export const HISTORY_POINTS = 240; // 1 hour (240 points at 15-second intervals)
export const DEFAULT_TX_SIZE = 250; // Default transaction size (average Bitcoin transaction) 