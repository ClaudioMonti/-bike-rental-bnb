const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { sendBookingConfirmation } = require('../utils/notifications');

// GET tutte le prenotazioni
router.get('/', async (req, res) => {
    try {
        const bookings = await db.all(
            `SELECT b.*, u.full_name, u.email, bk.name as bike_name, p.name as pricing_name
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN bikes bk ON b.bike_id = bk.id
             JOIN pricing p ON b.pricing_id = p.id
             ORDER BY b.created_at DESC`
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET prenotazione singola
router.get('/:id', async (req, res) => {
    try {
        const booking = await db.get(
            `SELECT b.*, u.full_name, u.email, u.phone, bk.name as bike_name, p.name as pricing_name, p.price
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN bikes bk ON b.bike_id = bk.id
             JOIN pricing p ON b.pricing_id = p.id
             WHERE b.id = ?`,
            [req.params.id]
        );

        if (!booking) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST nuova prenotazione
router.post('/', async (req, res) => {
    try {
        const { user_id, bike_id, pricing_id, start_time, estimated_end_time, notes } = req.body;

        // Validazione
        if (!user_id || !bike_id || !pricing_id || !start_time) {
            return res.status(400).json({ error: 'Dati mancanti' });
        }

        // Verifica disponibilità
        const existingBooking = await db.get(
            `SELECT * FROM bookings
             WHERE bike_id = ? AND status IN ('confirmed', 'active')
             AND (
                 (start_time <= ? AND COALESCE(end_time, estimated_end_time) >= ?)
             )`,
            [bike_id, start_time, start_time]
        );

        if (existingBooking) {
            return res.status(409).json({ error: 'Bicicletta non disponibile in questo periodo' });
        }

        // Ottieni prezzo
        const pricing = await db.get('SELECT * FROM pricing WHERE id = ?', [pricing_id]);
        if (!pricing) {
            return res.status(404).json({ error: 'Piano tariffario non trovato' });
        }

        // Crea prenotazione
        const result = await db.run(
            `INSERT INTO bookings (user_id, bike_id, pricing_id, start_time, estimated_end_time, total_price, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
            [user_id, bike_id, pricing_id, start_time, estimated_end_time, pricing.price, notes]
        );

        const booking = await db.get(
            `SELECT b.*, u.email, u.full_name FROM bookings b
             JOIN users u ON b.user_id = u.id
             WHERE b.id = ?`,
            [result.lastID]
        );

        res.status(201).json({
            message: 'Prenotazione creata con successo',
            booking
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT aggiorna stato prenotazione
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Stato non valido' });
        }

        await db.run(
            'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );

        // Se attivato, aggiorna lo stato della bici
        if (status === 'active') {
            const booking = await db.get('SELECT bike_id FROM bookings WHERE id = ?', [req.params.id]);
            await db.run('UPDATE bikes SET status = ? WHERE id = ?', ['rented', booking.bike_id]);
        }

        // Se completato o cancellato, libera la bici
        if (status === 'completed' || status === 'cancelled') {
            const booking = await db.get('SELECT bike_id FROM bookings WHERE id = ?', [req.params.id]);
            await db.run('UPDATE bikes SET status = ? WHERE id = ?', ['available', booking.bike_id]);
        }

        res.json({ message: 'Stato aggiornato con successo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT completa prenotazione (fine noleggio)
router.put('/:id/complete', async (req, res) => {
    try {
        const { end_time } = req.body;

        await db.run(
            `UPDATE bookings
             SET end_time = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [end_time || new Date().toISOString(), req.params.id]
        );

        // Libera la bici
        const booking = await db.get('SELECT bike_id FROM bookings WHERE id = ?', [req.params.id]);
        await db.run('UPDATE bikes SET status = ? WHERE id = ?', ['available', booking.bike_id]);

        res.json({ message: 'Noleggio completato con successo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET prenotazioni attive
router.get('/active/list', async (req, res) => {
    try {
        const activeBookings = await db.all(
            `SELECT b.*, u.full_name, u.email, bk.name as bike_name
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN bikes bk ON b.bike_id = bk.id
             WHERE b.status = 'active'`
        );

        res.json(activeBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
