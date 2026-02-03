// Admin Dashboard JavaScript

let adminToken = null;
let adminUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticazione
    checkAuth();

    // Carica dati dashboard
    await loadDashboard();

    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Auto-refresh ogni 30 secondi
    setInterval(loadDashboard, 30000);
});

// Verifica autenticazione
function checkAuth() {
    adminToken = localStorage.getItem('admin_token');
    adminUser = JSON.parse(localStorage.getItem('admin_user') || 'null');

    if (!adminToken || !adminUser) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Mostra nome admin
    document.getElementById('admin-name').textContent = `👤 ${adminUser.username}`;
}

// Carica dashboard
async function loadDashboard() {
    try {
        const data = await getDashboard(adminToken);

        // Aggiorna statistiche
        document.getElementById('total-bookings').textContent = data.stats.total_bookings;
        document.getElementById('active-bookings').textContent = data.stats.active_bookings;
        document.getElementById('total-revenue').textContent = `€${data.stats.total_revenue.toFixed(2)}`;
        document.getElementById('total-users').textContent = data.stats.total_users;

        // Mostra prenotazioni recenti
        displayRecentBookings(data.recent_bookings);

        // Mostra recensioni recenti
        displayRecentReviews(data.recent_reviews);

    } catch (error) {
        console.error('Errore caricamento dashboard:', error);

        if (error.message.includes('Token')) {
            // Token scaduto o invalido
            handleLogout();
        }
    }
}

// Mostra prenotazioni recenti
function displayRecentBookings(bookings) {
    const container = document.getElementById('recent-bookings-container');

    if (!bookings || bookings.length === 0) {
        container.innerHTML = '<p>Nessuna prenotazione recente.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Bici</th>
                    <th>Inizio</th>
                    <th>Stato</th>
                    <th>Pagamento</th>
                    <th>Totale</th>
                </tr>
            </thead>
            <tbody>
    `;

    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        const paymentClass = booking.payment_status === 'paid' ? 'status-completed' : 'status-pending';

        html += `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.full_name}</td>
                <td>${booking.bike_name}</td>
                <td>${new Date(booking.start_time).toLocaleString('it-IT')}</td>
                <td><span class="status-badge ${statusClass}">${translateStatus(booking.status)}</span></td>
                <td><span class="status-badge ${paymentClass}">${translatePaymentStatus(booking.payment_status)}</span></td>
                <td>€${booking.total_price.toFixed(2)}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Mostra recensioni recenti
function displayRecentReviews(reviews) {
    const container = document.getElementById('recent-reviews-container');

    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p>Nessuna recensione recente.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Rating</th>
                    <th>Commento</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
    `;

    reviews.forEach(review => {
        const stars = '⭐'.repeat(review.rating);

        html += `
            <tr>
                <td>${review.full_name}</td>
                <td>${stars} (${review.rating}/5)</td>
                <td>${review.comment || '-'}</td>
                <td>${new Date(review.created_at).toLocaleDateString('it-IT')}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Aggiorna dati GPS
async function refreshGPSData() {
    try {
        const liveBikes = await getLiveBikes();

        console.log('Bici in tempo reale:', liveBikes);

        // TODO: Implementare visualizzazione su mappa
        alert(`${liveBikes.length} biciclette attualmente noleggiate.\nVedi console per dettagli posizioni.`);

    } catch (error) {
        console.error('Errore aggiornamento GPS:', error);
        alert('Errore nell\'aggiornamento delle posizioni GPS');
    }
}

// Gestione logout
function handleLogout(e) {
    if (e) e.preventDefault();

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    window.location.href = 'admin-login.html';
}

// Utility functions
function getStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'active': 'status-active',
        'completed': 'status-completed',
        'cancelled': 'status-error'
    };

    return classes[status] || 'status-pending';
}

function translateStatus(status) {
    const translations = {
        'pending': 'In Attesa',
        'confirmed': 'Confermata',
        'active': 'Attiva',
        'completed': 'Completata',
        'cancelled': 'Cancellata'
    };

    return translations[status] || status;
}

function translatePaymentStatus(status) {
    const translations = {
        'unpaid': 'Non Pagato',
        'paid': 'Pagato',
        'refunded': 'Rimborsato'
    };

    return translations[status] || status;
}
