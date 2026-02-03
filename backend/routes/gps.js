const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// POST salva posizione GPS
router.post('/track', async (req, res) => {
    try {
        const { bike_id, booking_id, latitude, longitude, speed, battery_level } = req.body;

        if (!bike_id || !latitude || !longitude) {
            return res.status(400).json({ error: 'bike_id, latitude e longitude sono richiesti' });
        }

        await db.run(
            `INSERT INTO gps_tracking (bike_id, booking_id, latitude, longitude, speed, battery_level)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [bike_id, booking_id, latitude, longitude, speed, battery_level]
        );

        res.status(201).json({ message: 'Posizione salvata con successo' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ultima posizione di una bici
router.get('/bike/:bike_id/latest', async (req, res) => {
    try {
        const position = await db.get(
            `SELECT * FROM gps_tracking
             WHERE bike_id = ?
             ORDER BY timestamp DESC
             LIMIT 1`,
            [req.params.bike_id]
        );

        if (!position) {
            return res.status(404).json({ error: 'Nessuna posizione trovata per questa bici' });
        }

        res.json(position);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET storico posizioni di una prenotazione
router.get('/booking/:booking_id/history', async (req, res) => {
    try {
        const positions = await db.all(
            `SELECT * FROM gps_tracking
             WHERE booking_id = ?
             ORDER BY timestamp ASC`,
            [req.params.booking_id]
        );

        res.json({
            booking_id: req.params.booking_id,
            positions: positions,
            count: positions.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET posizioni in tempo reale di tutte le bici attive
router.get('/live/all', async (req, res) => {
    try {
        // Ottieni le bici attualmente noleggiate
        const activeBookings = await db.all(
            `SELECT b.id as booking_id, b.bike_id, bk.name as bike_name, b.start_time
             FROM bookings b
             JOIN bikes bk ON b.bike_id = bk.id
             WHERE b.status = 'active'`
        );

        // Per ogni prenotazione attiva, ottieni l'ultima posizione
        const liveBikes = await Promise.all(
            activeBookings.map(async (booking) => {
                const position = await db.get(
                    `SELECT * FROM gps_tracking
                     WHERE bike_id = ?
                     ORDER BY timestamp DESC
                     LIMIT 1`,
                    [booking.bike_id]
                );

                return {
                    ...booking,
                    last_position: position
                };
            })
        );

        res.json(liveBikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
