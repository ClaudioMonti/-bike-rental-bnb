const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST crea payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { booking_id } = req.body;

        if (!booking_id) {
            return res.status(400).json({ error: 'booking_id richiesto' });
        }

        // Ottieni dettagli prenotazione
        const booking = await db.get(
            `SELECT b.*, u.email, u.full_name, p.price
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN pricing p ON b.pricing_id = p.id
             WHERE b.id = ?`,
            [booking_id]
        );

        if (!booking) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        if (booking.payment_status === 'paid') {
            return res.status(400).json({ error: 'Prenotazione già pagata' });
        }

        // Crea Payment Intent con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.total_price * 100), // Stripe usa centesimi
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                booking_id: booking_id,
                user_email: booking.email,
                user_name: booking.full_name
            },
            receipt_email: booking.email,
            description: `Noleggio bicicletta - Prenotazione #${booking_id}`
        });

        // Salva payment_intent_id
        await db.run(
            'UPDATE bookings SET payment_intent_id = ? WHERE id = ?',
            [paymentIntent.id, booking_id]
        );

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Errore Stripe:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST webhook Stripe (per confermare pagamento)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gestisci eventi
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;

            // Aggiorna stato pagamento nel database
            await db.run(
                `UPDATE bookings
                 SET payment_status = 'paid', status = 'confirmed'
                 WHERE payment_intent_id = ?`,
                [paymentIntent.id]
            );

            console.log(`✓ Pagamento confermato: ${paymentIntent.id}`);
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log(`✗ Pagamento fallito: ${failedPayment.id}`);
            break;

        default:
            console.log(`Evento non gestito: ${event.type}`);
    }

    res.json({ received: true });
});

// GET verifica stato pagamento
router.get('/status/:booking_id', async (req, res) => {
    try {
        const booking = await db.get(
            'SELECT payment_status, payment_intent_id, total_price FROM bookings WHERE id = ?',
            [req.params.booking_id]
        );

        if (!booking) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        let paymentDetails = null;
        if (booking.payment_intent_id) {
            try {
                paymentDetails = await stripe.paymentIntents.retrieve(booking.payment_intent_id);
            } catch (error) {
                console.error('Errore recupero payment intent:', error);
            }
        }

        res.json({
            booking_id: req.params.booking_id,
            payment_status: booking.payment_status,
            total_price: booking.total_price,
            stripe_status: paymentDetails ? paymentDetails.status : null
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
