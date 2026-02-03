# Guida Setup - Sistema Noleggio Biciclette B&B

## Requisiti di Sistema

### Software Necessario
- Node.js 18+ e npm
- Git (opzionale)
- Un browser moderno

### Account Necessari
- Account Stripe (per pagamenti): https://stripe.com
- Account email SMTP (Gmail, SendGrid, ecc.)
- (Opzionale) Account Twilio per SMS

## Installazione

### 1. Backend Setup

```bash
# Entra nella cartella backend
cd backend

# Installa dipendenze
npm install

# Copia file di configurazione
cp .env.example .env

# Modifica .env con i tuoi dati
nano .env  # o usa il tuo editor preferito
```

#### Configurazione `.env`

Apri il file `.env` e configura:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...  # Dalla dashboard Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Dopo aver configurato webhook

# JWT (genera una stringa random sicura)
JWT_SECRET=una_stringa_molto_lunga_e_casuale_12345

# Email (esempio Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tuoemail@gmail.com
EMAIL_PASSWORD=tua_password_app  # Usa "App Password" non password normale

# Informazioni B&B
BNB_NAME=Il Mio B&B
BNB_EMAIL=info@miobnb.com
BNB_PHONE=+39 123 456 7890
BNB_ADDRESS=Via Example 123, Roma, Italia
```

#### Inizializza Database

```bash
# Crea database e tabelle
npm run init-db

# Verifica che sia stato creato
# Dovresti vedere: database/bike_rental.db
```

#### Genera QR Codes

```bash
# Genera QR codes per le biciclette
node utils/generateQR.js

# I QR codes saranno salvati in: public/qrcodes/
```

#### Avvia Server

```bash
# Modalità sviluppo (con auto-reload)
npm run dev

# O modalità produzione
npm start
```

Il server sarà disponibile su: http://localhost:3000

### 2. Frontend Setup

```bash
# Entra nella cartella frontend
cd ../frontend

# Installa dipendenze (opzionale, solo per dev server)
npm install

# Configura API endpoint
nano js/config.js
```

Modifica `js/config.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';  // O il tuo dominio
const STRIPE_PUBLIC_KEY = 'pk_test_your_key_here';  // Chiave pubblica Stripe
```

#### Avvia Frontend

Opzione 1: Server semplice
```bash
npm start
# Frontend disponibile su http://localhost:8080
```

Opzione 2: Live reload per sviluppo
```bash
npm run dev
```

Opzione 3: Servire file statici direttamente
```bash
# Usa qualsiasi web server
python -m http.server 8080
# O
npx serve . -p 8080
```

## Configurazione Stripe

### 1. Ottieni Chiavi API

1. Vai su https://dashboard.stripe.com
2. Registrati o fai login
3. Vai su Developers → API keys
4. Copia "Publishable key" e "Secret key"
5. Usa le chiavi **test** per lo sviluppo (iniziano con `pk_test_` e `sk_test_`)

### 2. Configura Webhook

I webhook permettono a Stripe di notificarti quando un pagamento è completato.

1. Vai su Developers → Webhooks
2. Clicca "Add endpoint"
3. URL endpoint: `https://tuo-dominio.com/api/payments/webhook`
4. Eventi da ascoltare:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia il "Signing secret" (inizia con `whsec_`)
6. Aggiungilo al file `.env` come `STRIPE_WEBHOOK_SECRET`

**Per sviluppo locale:**
```bash
# Usa Stripe CLI per testare webhook localmente
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### 3. Test Pagamento

Carte di test Stripe:
- **Successo**: 4242 4242 4242 4242
- **Errore**: 4000 0000 0000 0002
- Usa qualsiasi data futura per scadenza
- Usa qualsiasi CVV a 3 cifre

## Configurazione Email

### Opzione 1: Gmail

1. Abilita "App Password" per il tuo account Google
   - Vai su https://myaccount.google.com/security
   - Attiva autenticazione a 2 fattori
   - Genera "App Password"
2. Usa la password generata nel file `.env`

### Opzione 2: SendGrid

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Opzione 3: Altri Provider

Qualsiasi provider SMTP funziona. Consulta la documentazione del provider per:
- Host SMTP
- Porta (solitamente 587 o 465)
- Credenziali

## Prima Configurazione

### 1. Accedi come Admin

1. Vai su http://localhost:8080/admin-login.html
2. Credenziali di default:
   - Username: `admin`
   - Password: `admin123`
3. **IMPORTANTE**: Cambia subito la password!

#### Cambiare Password Admin

```bash
# Genera hash bcrypt per nuova password
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tua_nuova_password', 10).then(console.log)"

# Copia l'hash generato

# Aggiorna database
sqlite3 database/bike_rental.db
UPDATE admins SET password_hash = 'hash_copiato_qui' WHERE username = 'admin';
.quit
```

### 2. Configura Biciclette

Le biciclette di default sono già create. Per modificarle:

```bash
sqlite3 database/bike_rental.db

# Visualizza bici
SELECT * FROM bikes;

# Modifica descrizione
UPDATE bikes SET description = 'Nuova descrizione' WHERE id = 1;

.quit
```

### 3. Configura Prezzi

```bash
sqlite3 database/bike_rental.db

# Visualizza tariffe
SELECT * FROM pricing;

# Modifica prezzo
UPDATE pricing SET price = 6.00 WHERE id = 1;

.quit
```

### 4. Stampa QR Codes

I QR codes sono stati generati in `backend/public/qrcodes/`

1. Apri i file PNG
2. Stampali
3. Plastificali (opzionale ma consigliato)
4. Applicali alle biciclette

## Test del Sistema

### 1. Test Prenotazione Completa

1. Vai su http://localhost:8080
2. Clicca "Prenota Ora"
3. Compila form utente
4. Seleziona bici e tariffa
5. Usa carta di test Stripe: 4242 4242 4242 4242
6. Verifica email di conferma
7. Controlla dashboard admin

### 2. Test QR Code

1. Scansiona il QR code con smartphone
2. Dovresti essere reindirizzato alla pagina di prenotazione
3. La bici dovrebbe essere pre-selezionata

### 3. Test API

```bash
# Test endpoint bikes
curl http://localhost:3000/api/bikes

# Test endpoint pricing
curl http://localhost:3000/api/users/pricing/list

# Test health check
curl http://localhost:3000/health
```

## Deploy in Produzione

### Backend

#### Opzione 1: Heroku
```bash
# Installa Heroku CLI
heroku create nome-app

# Deploy
git push heroku main

# Configura variabili ambiente
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set JWT_SECRET=...
# ecc.

# Inizializza database
heroku run npm run init-db
```

#### Opzione 2: VPS (DigitalOcean, AWS, ecc.)
```bash
# Sul server
git clone your-repo
cd backend
npm install --production
npm run init-db

# Usa PM2 per mantenere il processo attivo
npm install -g pm2
pm2 start server.js --name bike-rental
pm2 save
pm2 startup
```

### Frontend

#### Opzione 1: Netlify
1. Connetti repository GitHub
2. Build command: (nessuno)
3. Publish directory: `frontend`
4. Deploy!

#### Opzione 2: Vercel
```bash
cd frontend
vercel deploy
```

#### Opzione 3: Stesso server del backend
```bash
# Copia file frontend nella cartella public del backend
cp -r frontend/* backend/public/

# Il backend servirà anche il frontend
```

### Database in Produzione

Per produzione, considera di passare a PostgreSQL:

1. Crea database PostgreSQL
2. Installa `pg` invece di `sqlite3`
3. Modifica `utils/database.js` per usare PostgreSQL
4. Converti schema SQL da SQLite a PostgreSQL

## Backup

### Backup Database
```bash
# Copia file database
cp backend/database/bike_rental.db backup/bike_rental_$(date +%Y%m%d).db

# O esporta SQL
sqlite3 backend/database/bike_rental.db .dump > backup.sql
```

### Backup Automatico (cron)
```bash
# Aggiungi a crontab
0 2 * * * cp /percorso/bike_rental.db /backup/bike_rental_$(date +\%Y\%m\%d).db
```

## Troubleshooting

### Il server non si avvia
- Verifica che la porta 3000 non sia già in uso
- Controlla i log per errori
- Verifica che tutte le dipendenze siano installate

### Le email non vengono inviate
- Verifica credenziali SMTP in `.env`
- Controlla che il provider email permetta SMTP
- Guarda i log del server per errori

### I pagamenti non funzionano
- Verifica chiavi Stripe corrette
- Usa carte di test in modalità test
- Controlla console browser per errori JavaScript

### QR code non funziona
- Verifica che FRONTEND_URL sia corretto in `.env`
- Rigenera QR codes: `node utils/generateQR.js`
- Controlla che il percorso nel QR sia raggiungibile

## Supporto

Per problemi o domande:
- Controlla i log: `backend/` e console browser
- Verifica configurazione `.env`
- Consulta documentazione API: http://localhost:3000

## Prossimi Passi

1. ✅ Sistema base installato
2. 📱 Integra GPS (vedi `GPS-INTEGRATION.md`)
3. 🎨 Personalizza design e branding
4. 📊 Aggiungi analytics (Google Analytics, ecc.)
5. 🌍 Traduzioni multiple lingue
6. 📱 App mobile (React Native, Flutter)
