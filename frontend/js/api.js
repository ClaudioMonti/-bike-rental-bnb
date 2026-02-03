// Utility per chiamate API
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Errore nella richiesta');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API Functions

// Biciclette
async function getBikes() {
    return await apiCall(API_ENDPOINTS.bikes);
}

async function getBikeByQR(qrCode) {
    return await apiCall(`${API_ENDPOINTS.bikes}/qr/${qrCode}`);
}

async function checkAvailability(startTime, endTime) {
    return await apiCall(`${API_ENDPOINTS.bikes}/availability/check?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`);
}

// Utenti
async function registerUser(userData) {
    return await apiCall(`${API_ENDPOINTS.users}/register`, {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async function getUserByEmail(email) {
    return await apiCall(`${API_ENDPOINTS.users}/email/${email}`);
}

async function getUserBookings(userId) {
    return await apiCall(`${API_ENDPOINTS.users}/${userId}/bookings`);
}

// Tariffe
async function getPricing() {
    return await apiCall(API_ENDPOINTS.pricing);
}

// Prenotazioni
async function createBooking(bookingData) {
    return await apiCall(API_ENDPOINTS.bookings, {
        method: 'POST',
        body: JSON.stringify(bookingData)
    });
}

async function getBooking(bookingId) {
    return await apiCall(`${API_ENDPOINTS.bookings}/${bookingId}`);
}

async function updateBookingStatus(bookingId, status) {
    return await apiCall(`${API_ENDPOINTS.bookings}/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
}

async function completeBooking(bookingId, endTime = null) {
    return await apiCall(`${API_ENDPOINTS.bookings}/${bookingId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ end_time: endTime || new Date().toISOString() })
    });
}

// Pagamenti
async function createPaymentIntent(bookingId) {
    return await apiCall(`${API_ENDPOINTS.payments}/create-payment-intent`, {
        method: 'POST',
        body: JSON.stringify({ booking_id: bookingId })
    });
}

async function getPaymentStatus(bookingId) {
    return await apiCall(`${API_ENDPOINTS.payments}/status/${bookingId}`);
}

// GPS
async function trackPosition(gpsData) {
    return await apiCall(`${API_ENDPOINTS.gps}/track`, {
        method: 'POST',
        body: JSON.stringify(gpsData)
    });
}

async function getLatestBikePosition(bikeId) {
    return await apiCall(`${API_ENDPOINTS.gps}/bike/${bikeId}/latest`);
}

async function getLiveBikes() {
    return await apiCall(`${API_ENDPOINTS.gps}/live/all`);
}

// Recensioni
async function createReview(reviewData) {
    return await apiCall(API_ENDPOINTS.reviews, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
}

async function getReviews() {
    return await apiCall(API_ENDPOINTS.reviews);
}

async function getBikeReviews(bikeId) {
    return await apiCall(`${API_ENDPOINTS.reviews}/bike/${bikeId}`);
}

async function getReviewsStats() {
    return await apiCall(`${API_ENDPOINTS.reviews}/stats/all`);
}

// Admin
async function adminLogin(credentials) {
    return await apiCall(`${API_ENDPOINTS.admin}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

async function getDashboard(token) {
    return await apiCall(`${API_ENDPOINTS.admin}/dashboard`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
