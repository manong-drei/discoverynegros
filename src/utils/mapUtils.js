export const buildGoogleMapsUrl = ({ latitude, longitude, query }) => {
  if (latitude != null && longitude != null) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }

  if (query) {
    return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
  }

  return '';
};

export const isValidGoogleMapsUrl = (url) =>
  typeof url === 'string' && /^https:\/\/maps\.google\.com\/\?q=.+/.test(url);
