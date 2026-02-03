// Configurazione API
// Auto-detect API URL: usa localhost in sviluppo, URL relativo in produzione
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

const STRIPE_PUBLIC_KEY = 'pk_test_your_stripe_public_key_here';

// Endpoints
const API_ENDPOINTS = {
    bikes: `${API_BASE_URL}/bikes`,
    bookings: `${API_BASE_URL}/bookings`,
    users: `${API_BASE_URL}/users`,
    payments: `${API_BASE_URL}/payments`,
    gps: `${API_BASE_URL}/gps`,
    reviews: `${API_BASE_URL}/reviews`,
    admin: `${API_BASE_URL}/admin`,
    pricing: `${API_BASE_URL}/users/pricing/list`
};
