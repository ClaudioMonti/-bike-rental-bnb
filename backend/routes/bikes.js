const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// GET tutte le biciclette
router.get('/', async (req, res) => {
    try {
        const bikes = await db.all('SELECT * FROM bikes ORDER BY id');
        res.json(bikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET singola bicicletta per ID
router.get('/:id', async (req, res) => {
    try {
        const bike = await db.get('SELECT * FROM bikes WHERE id = ?', [req.params.id]);
        if (!bike) {
            return res.status(404).json({ error: 'Bicicletta non trovata' });
        }
        res.json(bike);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET bicicletta da QR code
router.get('/qr/:qrCode', async (req, res) => {
    try {
        const bike = await db.get('SELECT * FROM bikes WHERE qr_code = ?', [req.params.qrCode]);
        if (!bike) {
            return res.status(404).json({ error: 'Bicicletta non trovata' });
        }

        // Controlla se è disponibile
        const activeBooking = await db.get(
            `SELECT * FROM bookings
             WHERE bike_id = ? AND status IN ('confirmed', 'active')
             AND datetime('now') BETWEEN start_time AND COALESCE(end_time, estimated_end_time)`,
            [bike.id]
        );

        res.json({
            ...bike,
            isAvailable: !activeBooking,
            currentBooking: activeBooking || null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET disponibilità biciclette
router.get('/availability/check', async (req, res) => {
    try {
        const { start_time, end_time } = req.query;

        if (!start_time || !end_time) {
            return res.status(400).json({ error: 'start_time e end_time sono richiesti' });
        }

        // Trova biciclette disponibili nel periodo richiesto
        const availableBikes = await db.all(
            `SELECT b.* FROM bikes b
             WHERE b.status = 'available'
             AND b.id NOT IN (
                 SELECT bike_id FROM bookings
                 WHERE status IN ('confirmed', 'active')
                 AND (
                     (start_time <= ? AND COALESCE(end_time, estimated_end_time) >= ?)
                     OR (start_time <= ? AND COALESCE(end_time, estimated_end_time) >= ?)
                     OR (start_time >= ? AND COALESCE(end_time, estimated_end_time) <= ?)
                 )
             )`,
            [start_time, start_time, end_time, end_time, start_time, end_time]
        );

        res.json({
            start_time,
            end_time,
            available_bikes: availableBikes,
            count: availableBikes.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
