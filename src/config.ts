export const API_URL = 'http://localhost:5000';

export const endpoints = {
    upload: `${API_URL}/upload`,
    photos: `${API_URL}/photos`,
    search: `${API_URL}/search`,
} as const;