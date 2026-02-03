const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Crea cartella per i QR codes se non esiste
const qrDir = path.join(__dirname, '../public/qrcodes');
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
}

// Funzione per generare QR code
async function generateQRCode(bikeId, qrCodeData) {
    try {
        // URL che gli utenti vedranno scannerizzando il QR
        const bookingUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/book/${qrCodeData}`;

        // Genera QR code come immagine
        const qrPath = path.join(qrDir, `bike-${bikeId}.png`);
        await QRCode.toFile(qrPath, bookingUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        console.log(`✓ QR Code generato per Bici ${bikeId}: ${qrPath}`);
        return qrPath;

    } catch (error) {
        console.error('Errore generazione QR code:', error);
        throw error;
    }
}

// Funzione per generare QR codes per tutte le bici
async function generateAllQRCodes() {
    const db = require('./database');

    try {
        const bikes = await db.all('SELECT * FROM bikes');

        for (const bike of bikes) {
            await generateQRCode(bike.id, bike.qr_code);
        }

        console.log(`\n✓ Generati ${bikes.length} QR codes in ${qrDir}`);

    } catch (error) {
        console.error('Errore:', error);
    }
}

// Se eseguito direttamente (non importato)
if (require.main === module) {
    generateAllQRCodes().then(() => {
        process.exit(0);
    });
}

module.exports = {
    generateQRCode,
    generateAllQRCodes
};
