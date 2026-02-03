# Sistema Noleggio Biciclette B&B

Sistema completo di noleggio biciclette con QR code, prenotazione online e tracciamento GPS.

## Caratteristiche

- 🚲 Gestione 2 biciclette
- 📱 Prenotazione via QR code
- 💳 Pagamento online (Stripe/PayPal/Revolut)
- 📍 Tracciamento GPS in tempo reale
- 📅 Calendario disponibilità
- 👨‍💼 Pannello amministrazione
- 📧 Notifiche automatiche email/SMS
- ⭐ Sistema recensioni

## Prezzi

- **Oraria**: €5/ora
- **Mezza giornata** (4 ore): €15
- **Giornata intera**: €25
- **Mensile**: €150

## Struttura Progetto

```
bike-rental-bnb/
├── frontend/          # Sito web per utenti
├── backend/           # API e logica server
├── database/          # Database e migrations
└── docs/             # Documentazione
```

## Tecnologie

- **Frontend**: HTML, CSS, JavaScript (React)
- **Backend**: Node.js + Express
- **Database**: SQLite/PostgreSQL
- **Pagamenti**: Stripe API
- **GPS**: Moduli GPS hardware + API tracking

## Setup

Vedi `docs/SETUP.md` per istruzioni dettagliate.
