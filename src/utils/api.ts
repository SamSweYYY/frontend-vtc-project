const DEFAULT_API_URL = 'http://localhost:3000/api';

export const API_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(/\/$/, '');

export function apiUrl(path: string) {
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
