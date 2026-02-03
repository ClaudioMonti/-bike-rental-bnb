const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'bike_rental.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Crea il database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Errore nella creazione del database:', err.message);
        process.exit(1);
    }
    console.log('✓ Database connesso/creato con successo');
});

// Leggi e esegui lo schema SQL
fs.readFile(schemaPath, 'utf8', (err, sql) => {
    if (err) {
        console.error('Errore nella lettura dello schema:', err.message);
        process.exit(1);
    }

    // Esegui lo schema (dividi per statement)
    db.exec(sql, (err) => {
        if (err) {
            console.error('Errore nell\'esecuzione dello schema:', err.message);
            process.exit(1);
        }

        console.log('✓ Schema database creato con successo');
        console.log('✓ Dati iniziali inseriti');
        console.log('\nDatabase pronto! Credenziali admin di default:');
        console.log('  Username: admin');
        console.log('  Password: admin123');
        console.log('  ⚠️  CAMBIA LA PASSWORD IN PRODUZIONE!');

        // Chiudi connessione
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('\n✓ Setup completato!');
        });
    });
});
