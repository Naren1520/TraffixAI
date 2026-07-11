const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || '';

export function apiUrl(path) {
  if (apiBaseUrl) {
    return `${apiBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}

export function wsUrl(path) {
  if (wsBaseUrl) {
    return `${wsBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}
