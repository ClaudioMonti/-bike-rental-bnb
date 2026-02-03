const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// POST crea nuova recensione
router.post('/', async (req, res) => {
    try {
        const { booking_id, user_id, rating, comment } = req.body;

        if (!booking_id || !user_id || !rating) {
            return res.status(400).json({ error: 'booking_id, user_id e rating sono richiesti' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Il rating deve essere tra 1 e 5' });
        }

        // Verifica che la prenotazione esista e sia completata
        const booking = await db.get(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = ?',
            [booking_id, user_id, 'completed']
        );

        if (!booking) {
            return res.status(404).json({ error: 'Prenotazione non trovata o non completata' });
        }

        // Verifica se esiste già una recensione
        const existingReview = await db.get(
            'SELECT * FROM reviews WHERE booking_id = ? AND user_id = ?',
            [booking_id, user_id]
        );

        if (existingReview) {
            return res.status(409).json({ error: 'Hai già recensito questa prenotazione' });
        }

        // Crea recensione
        const result = await db.run(
            'INSERT INTO reviews (booking_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [booking_id, user_id, rating, comment]
        );

        const review = await db.get('SELECT * FROM reviews WHERE id = ?', [result.lastID]);

        res.status(201).json({
            message: 'Recensione creata con successo',
            review
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET tutte le recensioni
router.get('/', async (req, res) => {
    try {
        const reviews = await db.all(
            `SELECT r.*, u.full_name, b.bike_id, bk.name as bike_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN bookings b ON r.booking_id = b.id
             JOIN bikes bk ON b.bike_id = bk.id
             ORDER BY r.created_at DESC`
        );

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET recensioni per una specifica bici
router.get('/bike/:bike_id', async (req, res) => {
    try {
        const reviews = await db.all(
            `SELECT r.*, u.full_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN bookings b ON r.booking_id = b.id
             WHERE b.bike_id = ?
             ORDER BY r.created_at DESC`,
            [req.params.bike_id]
        );

        // Calcola media rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            bike_id: req.params.bike_id,
            reviews: reviews,
            average_rating: avgRating.toFixed(1),
            total_reviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET statistiche recensioni
router.get('/stats/all', async (req, res) => {
    try {
        const stats = await db.get(
            `SELECT
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
             FROM reviews`
        );

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
