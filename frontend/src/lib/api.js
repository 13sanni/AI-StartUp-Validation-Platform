// Central API configuration — all fetch calls should use this base URL
// In development: reads from .env.development (VITE_API_URL=http://localhost:5000)
// In production: set VITE_API_URL to your deployed backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
