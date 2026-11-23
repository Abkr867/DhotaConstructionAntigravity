/**
 * Centralized API & Backend Configuration
 * Single source of truth for backend endpoints across all frontend pages and components.
 */
export const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:8001";

export const API = `${BACKEND_URL}/api`;
