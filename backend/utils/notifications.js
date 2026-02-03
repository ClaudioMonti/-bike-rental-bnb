const nodemailer = require('nodemailer');
const db = require('./database');

// Configura transporter email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Funzione per inviare email
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.BNB_NAME}" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });

        console.log('Email inviata:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Errore invio email:', error);
        return { success: false, error: error.message };
    }
}

// Email di conferma prenotazione
async function sendBookingConfirmation(booking, user, bike, pricing) {
    const subject = `Conferma Prenotazione Bicicletta - ${process.env.BNB_NAME}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Prenotazione Confermata!</h1>
                </div>
                <div class="content">
                    <p>Ciao ${user.full_name},</p>
                    <p>La tua prenotazione è stata confermata con successo!</p>

                    <div class="details">
                        <h3>Dettagli Prenotazione</h3>
                        <p><strong>Numero Prenotazione:</strong> #${booking.id}</p>
                        <p><strong>Bicicletta:</strong> ${bike.name}</p>
                        <p><strong>Tariffa:</strong> ${pricing.name}</p>
                        <p><strong>Prezzo:</strong> €${booking.total_price}</p>
                        <p><strong>Inizio:</strong> ${new Date(booking.start_time).toLocaleString('it-IT')}</p>
                        ${booking.estimated_end_time ? `<p><strong>Fine prevista:</strong> ${new Date(booking.estimated_end_time).toLocaleString('it-IT')}</p>` : ''}
                    </div>

                    <p>Ti aspettiamo presso il nostro B&B per ritirare la bicicletta!</p>

                    <p><strong>Indirizzo:</strong><br>${process.env.BNB_ADDRESS}</p>
                    <p><strong>Telefono:</strong> ${process.env.BNB_PHONE}</p>
                </div>
                <div class="footer">
                    <p>${process.env.BNB_NAME}<br>
                    ${process.env.BNB_EMAIL}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const result = await sendEmail(user.email, subject, html);

    // Salva notifica nel database
    await db.run(
        `INSERT INTO notifications (user_id, booking_id, type, subject, message, status, sent_at)
         VALUES (?, ?, 'email', ?, ?, ?, CURRENT_TIMESTAMP)`,
        [user.id, booking.id, subject, html, result.success ? 'sent' : 'failed']
    );

    return result;
}

// Email di promemoria
async function sendBookingReminder(booking, user, bike) {
    const subject = `Promemoria: Ritiro Bicicletta Oggi - ${process.env.BNB_NAME}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Promemoria Prenotazione</h1>
                </div>
                <div class="content">
                    <p>Ciao ${user.full_name},</p>
                    <p>Ti ricordiamo che oggi hai prenotato la ${bike.name}!</p>
                    <p><strong>Orario:</strong> ${new Date(booking.start_time).toLocaleString('it-IT')}</p>
                    <p>Ci vediamo presto!</p>
                    <p><strong>${process.env.BNB_NAME}</strong><br>
                    ${process.env.BNB_ADDRESS}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(user.email, subject, html);
}

// Email richiesta recensione
async function sendReviewRequest(booking, user, bike) {
    const subject = `Come è andata? Lascia una recensione - ${process.env.BNB_NAME}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .stars { font-size: 30px; text-align: center; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Grazie per aver scelto ${process.env.BNB_NAME}!</h1>
                </div>
                <div class="content">
                    <p>Ciao ${user.full_name},</p>
                    <p>Speriamo che tu abbia apprezzato il noleggio della ${bike.name}!</p>
                    <p>Ci piacerebbe sapere com'è andata. Lascia una recensione!</p>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/review/${booking.id}" style="display: inline-block; padding: 10px 20px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px;">Lascia una Recensione</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(user.email, subject, html);
}

module.exports = {
    sendEmail,
    sendBookingConfirmation,
    sendBookingReminder,
    sendReviewRequest
};
