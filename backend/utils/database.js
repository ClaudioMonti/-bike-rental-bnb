const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const util = require('util');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/bike_rental.db');

// Crea connessione database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Errore connessione database:', err.message);
        process.exit(1);
    }
    console.log('✓ Connesso al database SQLite');
});

// Promisify delle funzioni del database per usare async/await
const dbRun = util.promisify(db.run.bind(db));
const dbGet = util.promisify(db.get.bind(db));
const dbAll = util.promisify(db.all.bind(db));

// Esporta funzioni wrapped
module.exports = {
    run: dbRun,
    get: dbGet,
    all: dbAll,
    db: db
};
