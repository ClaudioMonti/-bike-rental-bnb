# Guida Rapida - Sistema Noleggio Biciclette B&B

## Cosa è Stato Creato

Un sistema completo di noleggio biciclette con:

### ✅ Backend (Node.js + Express)
- API REST complete per tutte le funzionalità
- Database SQLite con schema completo
- Integrazione pagamenti Stripe
- Sistema notifiche email
- Autenticazione admin con JWT
- Supporto tracciamento GPS

### ✅ Frontend (HTML/CSS/JavaScript)
- Landing page responsive
- Sistema prenotazione multi-step
- Integrazione pagamenti Stripe
- Dashboard amministratore
- Visualizzazione recensioni

### ✅ Funzionalità
1. **Prenotazione via QR Code** - Gli ospiti scannerizzano e prenotano
2. **Pagamento Online** - Stripe, PayPal, Revolut
3. **Prezzi Flessibili** - Oraria, giornaliera, mensile
4. **Tracciamento GPS** - Sistema pronto per hardware GPS
5. **Pannello Admin** - Gestione completa prenotazioni
6. **Notifiche Email** - Conferme automatiche
7. **Sistema Recensioni** - Feedback degli ospiti

## Avvio Rapido (5 Minuti)

### 1. Installa Dipendenze Backend

```bash
cd backend
npm install
```

### 2. Configura Ambiente

```bash
# Copia file configurazione
cp .env.example .env

# Modifica con i tuoi dati (minimo necessario per test)
# Per ora puoi lasciare i valori di default e modificare solo:
PORT=3000
```

### 3. Inizializza Database

```bash
npm run init-db
```

Vedrai:
```
✓ Database connesso/creato con successo
✓ Schema database creato con successo
✓ Dati iniziali inseriti

Database pronto! Credenziali admin di default:
  Username: admin
  Password: admin123
```

### 4. Genera QR Codes

```bash
node utils/generateQR.js
```

I QR codes saranno in `backend/public/qrcodes/`

### 5. Avvia Backend

```bash
npm run dev
```

Vedrai:
```
✓ Connesso al database SQLite
🚲 Server avviato su porta 3000
📍 API disponibile su http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

### 6. Avvia Frontend (Nuovo Terminale)

```bash
cd ../frontend
npx serve . -p 8080
```

### 7. Apri il Browser

- **Frontend**: http://localhost:8080
- **Admin**: http://localhost:8080/admin-login.html
  - Username: `admin`
  - Password: `admin123`

## Test Veloce

### 1. Prova Prenotazione
1. Vai su http://localhost:8080
2. Clicca "Prenota Ora"
3. Inserisci dati (usa email reale per test notifiche)
4. Per il pagamento, lascia in sospeso (Stripe non configurato ancora)

### 2. Accedi Admin
1. Vai su http://localhost:8080/admin-login.html
2. Login con admin/admin123
3. Vedi dashboard con statistiche

## Configurazione Completa

Per usare il sistema in produzione, configura:

### 1. Stripe (Pagamenti)
1. Registrati su https://stripe.com
2. Ottieni chiavi API da Developers → API keys
3. Aggiungi a `.env`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   ```
4. Aggiorna `frontend/js/config.js` con la chiave pubblica

### 2. Email (Notifiche)
1. Se usi Gmail:
   - Abilita autenticazione 2FA
   - Genera "App Password"
2. Aggiungi a `.env`:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tua_email@gmail.com
   EMAIL_PASSWORD=password_app_generata
   ```

### 3. Informazioni B&B
Modifica in `.env`:
```bash
BNB_NAME=Nome del Tuo B&B
BNB_EMAIL=info@tuobnb.com
BNB_PHONE=+39 123 456 7890
BNB_ADDRESS=Via Example 123, Città, Italia
```

## Struttura Progetto

```
bike-rental-bnb/
├── backend/                  # Server Node.js
│   ├── server.js            # Entry point
│   ├── routes/              # API endpoints
│   ├── utils/               # Database, email, QR
│   ├── database/            # SQLite database
│   └── public/              # QR codes generati
│
├── frontend/                 # Sito web
│   ├── index.html           # Landing page
│   ├── booking.html         # Sistema prenotazione
│   ├── admin-*.html         # Pannello admin
│   ├── css/                 # Stili
│   └── js/                  # Logica frontend
│
├── docs/                     # Documentazione
│   ├── SETUP.md             # Setup completo
│   └── GPS-INTEGRATION.md   # Guida GPS
│
└── README.md                # Panoramica progetto
```

## Prossimi Passi

### Immediate (Prima di Lanciare)
- [ ] Configura Stripe con le tue chiavi
- [ ] Configura email SMTP
- [ ] Cambia password admin
- [ ] Modifica prezzi se necessario
- [ ] Stampa QR codes e applicali alle bici
- [ ] Personalizza nome B&B e contatti

### Medio Termine
- [ ] Deploy su server production
- [ ] Configura dominio personalizzato
- [ ] Acquista hardware GPS (vedi GPS-INTEGRATION.md)
- [ ] Testa con prenotazioni reali
- [ ] Raccogli recensioni

### Lungo Termine
- [ ] Personalizza design/branding
- [ ] Aggiungi più biciclette
- [ ] Implementa app mobile
- [ ] Aggiungi analytics
- [ ] Sistema di sconti/promozioni

## Prezzi di Default

| Tariffa | Durata | Prezzo |
|---------|--------|--------|
| Oraria | 1 ora | €5.00 |
| Mezza Giornata | 4 ore | €15.00 |
| Giornata Intera | 24 ore | €25.00 |
| Mensile | 30 giorni | €150.00 |

Per modificare, vedi documentazione SETUP.md

## Biciclette di Default

- **Bici 1**: City Bike (QR: BIKE001-QR-CODE)
- **Bici 2**: Mountain Bike (QR: BIKE002-QR-CODE)

## Endpoint API Principali

### Pubblici
- `GET /api/bikes` - Lista biciclette
- `GET /api/users/pricing/list` - Tariffe
- `POST /api/bookings` - Nuova prenotazione
- `POST /api/payments/create-payment-intent` - Pagamento

### Admin (Richiedono Token)
- `POST /api/admin/login` - Login admin
- `GET /api/admin/dashboard` - Statistiche

Documentazione API completa: http://localhost:3000

## Troubleshooting Rapido

### "Cannot find module..."
```bash
cd backend
npm install
```

### "Port 3000 already in use"
Cambia porta in `.env`:
```bash
PORT=3001
```

### "ENOENT: no such file..."
Assicurati di essere nella cartella corretta:
```bash
# Per backend
cd backend

# Per frontend
cd frontend
```

### Database non si crea
```bash
# Manualmente
cd backend
node database/init.js
```

## Supporto e Documentazione

- **Setup Completo**: `docs/SETUP.md`
- **Integrazione GPS**: `docs/GPS-INTEGRATION.md`
- **README**: `README.md`

## Domande Frequenti

**Q: Posso usarlo senza Stripe?**
A: Sì, puoi accettare pagamenti in loco. La prenotazione funzionerà comunque.

**Q: Serve veramente l'hardware GPS?**
A: No, è opzionale. Il sistema traccia inizio/fine noleggio anche senza GPS.

**Q: Posso aggiungere più biciclette?**
A: Sì! Aggiungi direttamente nel database o tramite pannello admin (da implementare).

**Q: Funziona con altri metodi di pagamento?**
A: Stripe supporta molti metodi. Per Revolut, configura in Stripe.

**Q: Posso personalizzare il design?**
A: Sì! Modifica i file in `frontend/css/`

## Licenza

Questo progetto è creato per uso personale. Personalizzalo come preferisci!

---

**Buon noleggio! 🚲**
