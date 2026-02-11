require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Aggiorna tariffe e biciclette all'avvio
async function syncData() {
    try {
        // Aggiorna tariffe
        await db.run('DELETE FROM pricing');
        const plans = [
            ['Mezza Giornata', 4, 7.99, '€7.99 per 4 ore'],
            ['Giornata Intera', 24, 14.99, '€14.99 per 24 ore'],
            ['3 Giorni', 72, 29.99, '€29.99 per 3 giorni'],
            ['Settimanale', 168, 49.99, '€49.99 per 7 giorni'],
            ['15 Giorni', 360, 69.99, '€69.99 per 15 giorni'],
            ['Mensile', 720, 99.99, '€99.99 per 30 giorni']
        ];
        for (const [name, hours, price, desc] of plans) {
            await db.run(
                'INSERT INTO pricing (name, duration_hours, price, description, is_active) VALUES (?, ?, ?, ?, 1)',
                [name, hours, price, desc]
            );
        }
        console.log('✓ Tariffe aggiornate');

        // Aggiorna biciclette (nome e descrizione)
        await db.run(
            "UPDATE bikes SET name = 'Bici 1 - Mountain Bike', description = 'Mountain bike per percorsi avventurosi' WHERE qr_code = 'BIKE001-QR-CODE'"
        );
        await db.run(
            "UPDATE bikes SET name = 'Bici 2 - Mountain Bike', description = 'Mountain bike per percorsi avventurosi' WHERE qr_code = 'BIKE002-QR-CODE'"
        );
        console.log('✓ Biciclette aggiornate');
    } catch (err) {
        console.error('Errore sync dati:', err.message);
    }
}

syncData();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire file statici (QR codes, immagini)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Servire il frontend in produzione
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const bikesRoutes = require('./routes/bikes');
const bookingsRoutes = require('./routes/bookings');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const paymentsRoutes = require('./routes/payments');
const gpsRoutes = require('./routes/gps');
const reviewsRoutes = require('./routes/reviews');

app.use('/api/bikes', bikesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Route principale
app.get('/', (req, res) => {
    res.json({
        message: 'API Sistema Noleggio Biciclette B&B',
        version: '1.0.0',
        endpoints: {
            bikes: '/api/bikes',
            bookings: '/api/bookings',
            users: '/api/users',
            admin: '/api/admin',
            payments: '/api/payments',
            gps: '/api/gps',
            reviews: '/api/reviews'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Qualcosa è andato storto!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Serve index.html per tutte le altre route (frontend)
app.get('*', (req, res) => {
    // Se la richiesta e' per API, restituisci 404 JSON
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint non trovato' });
    }
    // Altrimenti servi il frontend
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Avvio server
app.listen(PORT, () => {
    console.log(`🚲 Server avviato su porta ${PORT}`);
    console.log(`📍 API disponibile su http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
