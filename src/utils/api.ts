const DEFAULT_API_URL = 'https://vtc-api-ho4o.onrender.com';

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export function apiUrl(path: string) {
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
