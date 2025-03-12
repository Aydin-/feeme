// Number formatting utilities
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

export const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export const formatHashrate = (hashrate) => {
  const sizes = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
  if (hashrate === 0) return '0 H/s';
  const i = parseInt(Math.floor(Math.log(hashrate) / Math.log(1000)));
  return Math.round(hashrate / Math.pow(1000, i), 2) + ' ' + sizes[i];
}; 