-- Database Schema per Sistema Noleggio Biciclette

-- Tabella Biciclette
CREATE TABLE IF NOT EXISTS bikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    qr_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available', -- available, rented, maintenance
    gps_device_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Utenti/Ospiti
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT NOT NULL,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prezzi
CREATE TABLE IF NOT EXISTS pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, -- 'hourly', 'half_day', 'full_day', 'monthly'
    duration_hours INTEGER,
    price REAL NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prenotazioni
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bike_id INTEGER NOT NULL,
    pricing_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    estimated_end_time DATETIME,
    status TEXT DEFAULT 'pending', -- pending, confirmed, active, completed, cancelled
    total_price REAL,
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
    payment_intent_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (pricing_id) REFERENCES pricing(id)
);

-- Tabella Posizioni GPS
CREATE TABLE IF NOT EXISTS gps_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bike_id INTEGER NOT NULL,
    booking_id INTEGER,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    speed REAL,
    battery_level INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Tabella Recensioni
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabella Admin
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Notifiche
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    booking_id INTEGER,
    type TEXT NOT NULL, -- email, sms
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Inserimento dati iniziali

-- Inserisci le 2 biciclette
INSERT INTO bikes (name, description, qr_code, status) VALUES
('Bici 1 - City Bike', 'Bicicletta da città comoda e veloce', 'BIKE001-QR-CODE', 'available'),
('Bici 2 - Mountain Bike', 'Mountain bike per percorsi avventurosi', 'BIKE002-QR-CODE', 'available');

-- Inserisci i prezzi
INSERT INTO pricing (name, duration_hours, price, description) VALUES
('Mezza Giornata', 4, 15.00, '€15 per 4 ore'),
('Giornata Intera', 24, 20.00, '€20 per 24 ore'),
('Mensile', 720, 120.00, '€120 per 30 giorni');

-- Crea un admin di default (password: admin123 - da cambiare!)
-- Hash bcrypt di 'admin123': $2b$10$rKZI0YCqGqF.LZzJZqXRnO7rqXHqV5qHZQXqJZqZQXqJZqZQXqJZq
INSERT INTO admins (username, email, password_hash) VALUES
('admin', 'admin@tuobnb.com', '$2b$10$rKZI0YCqGqF.LZzJZqXRnO7rqXHqV5qHZQXqJZqZQXqJZqZQXqJZq');
