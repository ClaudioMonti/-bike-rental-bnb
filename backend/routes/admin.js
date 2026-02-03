const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware per verificare token admin
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token non fornito' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token non valido' });
    }
};

// POST login admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password richiesti' });
        }

        const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);

        if (!admin) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        const validPassword = await bcrypt.compare(password, admin.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        // Genera token JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login effettuato con successo',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET dashboard statistiche (protetto)
router.get('/dashboard', verifyAdminToken, async (req, res) => {
    try {
        // Statistiche generali
        const totalBookings = await db.get('SELECT COUNT(*) as count FROM bookings');
        const activeBookings = await db.get('SELECT COUNT(*) as count FROM bookings WHERE status = ?', ['active']);
        const totalRevenue = await db.get('SELECT SUM(total_price) as total FROM bookings WHERE payment_status = ?', ['paid']);
        const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');

        // Prenotazioni recenti
        const recentBookings = await db.all(
            `SELECT b.*, u.full_name, bk.name as bike_name
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN bikes bk ON b.bike_id = bk.id
             ORDER BY b.created_at DESC
             LIMIT 10`
        );

        // Recensioni recenti
        const recentReviews = await db.all(
            `SELECT r.*, u.full_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             ORDER BY r.created_at DESC
             LIMIT 5`
        );

        res.json({
            stats: {
                total_bookings: totalBookings.count,
                active_bookings: activeBookings.count,
                total_revenue: totalRevenue.total || 0,
                total_users: totalUsers.count
            },
            recent_bookings: recentBookings,
            recent_reviews: recentReviews
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT aggiorna stato bici (protetto)
router.put('/bikes/:id/status', verifyAdminToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['available', 'rented', 'maintenance'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Stato non valido' });
        }

        await db.run(
            'UPDATE bikes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Stato bici aggiornato con successo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT aggiorna prezzi (protetto)
router.put('/pricing/:id', verifyAdminToken, async (req, res) => {
    try {
        const { price, is_active } = req.body;

        await db.run(
            'UPDATE pricing SET price = ?, is_active = ? WHERE id = ?',
            [price, is_active ? 1 : 0, req.params.id]
        );

        res.json({ message: 'Prezzo aggiornato con successo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET report prenotazioni per periodo (protetto)
router.get('/reports/bookings', verifyAdminToken, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = `
            SELECT b.*, u.full_name, u.email, bk.name as bike_name, p.name as pricing_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN bikes bk ON b.bike_id = bk.id
            JOIN pricing p ON b.pricing_id = p.id
        `;

        const params = [];

        if (start_date && end_date) {
            query += ' WHERE b.start_time BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        query += ' ORDER BY b.start_time DESC';

        const bookings = await db.all(query, params);

        // Calcola statistiche
        const totalRevenue = bookings
            .filter(b => b.payment_status === 'paid')
            .reduce((sum, b) => sum + b.total_price, 0);

        res.json({
            bookings,
            summary: {
                total_bookings: bookings.length,
                total_revenue: totalRevenue,
                paid_bookings: bookings.filter(b => b.payment_status === 'paid').length,
                cancelled_bookings: bookings.filter(b => b.status === 'cancelled').length
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
