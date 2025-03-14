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

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (num) => String(num).padStart(2, '0');
  
  const formats = {
    'YYYY': date.getFullYear(),
    'MMM': months[date.getMonth()],
    'MM': pad(date.getMonth() + 1),
    'M': date.getMonth() + 1,
    'DD': pad(date.getDate()),
    'D': date.getDate(),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds())
  };
  
  return format.replace(/YYYY|MMM|MM|M|DD|D|HH|mm|ss/g, match => formats[match]);
}; 