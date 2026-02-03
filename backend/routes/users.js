const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const bcrypt = require('bcrypt');

// POST registrazione nuovo utente
router.post('/register', async (req, res) => {
    try {
        const { email, phone, full_name, password } = req.body;

        // Validazione
        if (!email || !full_name) {
            return res.status(400).json({ error: 'Email e nome completo sono richiesti' });
        }

        // Verifica se email esiste già
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(409).json({ error: 'Email già registrata' });
        }

        // Hash password se fornita
        let passwordHash = null;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        // Crea utente
        const result = await db.run(
            'INSERT INTO users (email, phone, full_name, password_hash) VALUES (?, ?, ?, ?)',
            [email, phone, full_name, passwordHash]
        );

        const user = await db.get('SELECT id, email, phone, full_name, created_at FROM users WHERE id = ?', [result.lastID]);

        res.status(201).json({
            message: 'Utente registrato con successo',
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET utente per email
router.get('/email/:email', async (req, res) => {
    try {
        const user = await db.get(
            'SELECT id, email, phone, full_name, created_at FROM users WHERE email = ?',
            [req.params.email]
        );

        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET prenotazioni di un utente
router.get('/:id/bookings', async (req, res) => {
    try {
        const bookings = await db.all(
            `SELECT b.*, bk.name as bike_name, p.name as pricing_name
             FROM bookings b
             JOIN bikes bk ON b.bike_id = bk.id
             JOIN pricing p ON b.pricing_id = p.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.params.id]
        );

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET piani tariffari
router.get('/pricing/list', async (req, res) => {
    try {
        const pricing = await db.all('SELECT * FROM pricing WHERE is_active = 1 ORDER BY duration_hours');
        res.json(pricing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
