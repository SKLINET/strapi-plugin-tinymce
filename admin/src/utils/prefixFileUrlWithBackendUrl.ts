export const prefixFileUrlWithBackendUrl = (path: string, defaultDomain = 'http://localhost:1337') => {
  if (path?.startsWith('http')) {
    return path;
  }
  const url = process.env.BACKEND_URL;

  if (url) {
    return url + path;
  } else {
    return defaultDomain + path;
  }
};
