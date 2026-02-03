# Guida all'Integrazione GPS

## Panoramica

Il sistema di noleggio biciclette include il supporto per il tracciamento GPS in tempo reale. Questa funzionalità richiede hardware GPS aggiuntivo installato sulle biciclette.

## Hardware Necessario

### Opzione 1: Tracker GPS 4G (Consigliato)
- **Dispositivo**: GPS Tracker 4G con SIM card
- **Esempi**: Jimi JM-VL02, Coban TK103, Teltonika FMB920
- **Caratteristiche richieste**:
  - Connessione 4G/LTE per invio dati in tempo reale
  - Batteria ricaricabile (autonomia minima 7 giorni)
  - Protezione IP65 (resistente ad acqua e polvere)
  - API HTTP/MQTT per invio coordinate

### Opzione 2: GPS + Arduino/Raspberry Pi
- **Componenti**:
  - Modulo GPS (es. NEO-6M o NEO-7M)
  - Scheda Arduino/Raspberry Pi con connettività mobile
  - Batteria e circuito di alimentazione
  - Case impermeabile

### Opzione 3: Smartphone come Tracker
- Usare uno smartphone economico con app di tracking
- Più economico ma meno affidabile
- Richiede ricarica frequente

## Costi Stimati

| Opzione | Costo per Bici | Costo Mensile |
|---------|---------------|---------------|
| GPS Tracker 4G | €50-150 | €5-10 (SIM data) |
| Arduino + GPS | €30-80 | €5-10 (SIM data) |
| Smartphone | €50-100 | €5-15 (piano dati) |

## Installazione Hardware

### Posizionamento
- Montare il tracker sotto il sellino o nel telaio
- Assicurarsi che l'antenna GPS abbia vista del cielo
- Proteggere da acqua e urti

### Alimentazione
- Collegare alla dinamo della bici (se disponibile)
- O usare batteria ricaricabile dedicata
- Configurare allarmi per batteria scarica

## Integrazione Software

### 1. Configurazione Device

Ogni tracker GPS deve essere configurato per inviare dati all'API:

```bash
# Endpoint API per ricevere coordinate GPS
POST http://your-domain.com/api/gps/track

# Payload JSON
{
  "bike_id": 1,
  "booking_id": 123,
  "latitude": 41.9028,
  "longitude": 12.4964,
  "speed": 15.5,
  "battery_level": 85
}
```

### 2. Configurazione Tracker

La maggior parte dei tracker GPS 4G supporta comandi SMS o configurazione via app:

**Esempio comandi SMS per tracker Coban:**
```
# Imposta APN (sostituisci con il tuo operatore)
apn123456 your-apn-name

# Imposta server endpoint
adminip123456 your-domain.com 3000

# Imposta intervallo di invio (30 secondi)
upload123456 30
```

### 3. Webhook/Callback

Se il tracker non supporta POST diretti, puoi:

1. Usare piattaforme intermedie (es. ThingsBoard, AWS IoT)
2. Creare un bridge MQTT → HTTP
3. Usare servizi cloud del produttore GPS

#### Esempio con MQTT:
```javascript
// backend/mqtt-bridge.js
const mqtt = require('mqtt');
const axios = require('axios');

const client = mqtt.connect('mqtt://your-mqtt-broker.com');

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());

  // Invia all'API
  axios.post('http://localhost:3000/api/gps/track', {
    bike_id: data.device_id,
    latitude: data.lat,
    longitude: data.lon,
    speed: data.speed,
    battery_level: data.battery
  });
});

client.subscribe('gps/+/location');
```

## Testing

### Test Senza Hardware

Durante lo sviluppo, puoi simulare i dati GPS:

```javascript
// Script di test: test-gps.js
const axios = require('axios');

// Simula movimento di una bici
setInterval(async () => {
  const lat = 41.9028 + (Math.random() - 0.5) * 0.01;
  const lon = 12.4964 + (Math.random() - 0.5) * 0.01;

  await axios.post('http://localhost:3000/api/gps/track', {
    bike_id: 1,
    booking_id: 1,
    latitude: lat,
    longitude: lon,
    speed: Math.random() * 25,
    battery_level: 85
  });

  console.log('GPS data sent:', { lat, lon });
}, 5000); // Ogni 5 secondi
```

## Visualizzazione Mappa

Per visualizzare le posizioni GPS sulla dashboard admin, puoi integrare:

### Opzione 1: Leaflet (Open Source)
```html
<!-- Aggiungi a admin-dashboard.html -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
// Inizializza mappa
const map = L.map('gps-map').setView([41.9028, 12.4964], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Aggiungi marker per ogni bici
async function updateBikePositions() {
  const bikes = await getLiveBikes();

  bikes.forEach(bike => {
    if (bike.last_position) {
      L.marker([bike.last_position.latitude, bike.last_position.longitude])
        .addTo(map)
        .bindPopup(`Bici: ${bike.bike_name}<br>Velocità: ${bike.last_position.speed} km/h`);
    }
  });
}
</script>
```

### Opzione 2: Google Maps
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

## Privacy e GDPR

### Conformità
- Informare gli utenti del tracciamento GPS nei termini di servizio
- Salvare dati GPS solo durante il noleggio attivo
- Eliminare dati GPS dopo 30 giorni (configurable)
- Consentire agli utenti di richiedere l'eliminazione dei propri dati

### Script Pulizia Automatica
```javascript
// backend/cron/cleanup-gps.js
const db = require('../utils/database');

// Elimina dati GPS più vecchi di 30 giorni
async function cleanupOldGPSData() {
  await db.run(
    `DELETE FROM gps_tracking
     WHERE timestamp < datetime('now', '-30 days')`
  );

  console.log('✓ Vecchi dati GPS eliminati');
}

// Esegui ogni giorno
setInterval(cleanupOldGPSData, 24 * 60 * 60 * 1000);
```

## Sicurezza

### Protezione Endpoint
- Implementare autenticazione API per endpoint GPS
- Usare HTTPS per tutte le comunicazioni
- Limitare rate di richieste per prevenire spam

```javascript
// backend/middleware/gps-auth.js
function verifyGPSDevice(req, res, next) {
  const apiKey = req.headers['x-gps-api-key'];

  if (!apiKey || apiKey !== process.env.GPS_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

// Applica a route GPS
router.post('/track', verifyGPSDevice, handleGPSTrack);
```

## Troubleshooting

### Il tracker non invia dati
1. Verifica copertura 4G/LTE
2. Controlla configurazione APN
3. Verifica endpoint e porta corretti
4. Controlla log del server per errori

### Posizioni imprecise
1. Assicurati che il GPS abbia vista del cielo
2. Attendi acquisizione satelliti (può richiedere 1-2 minuti)
3. Verifica che non ci siano interferenze metalliche

### Batteria si scarica rapidamente
1. Riduci frequenza invio dati (es. da 30s a 60s)
2. Usa modalità sleep quando la bici è ferma
3. Verifica che non ci siano cortocircuiti

## Fornitori Consigliati

### Hardware GPS
- **Jimi IoT**: https://www.jimilab.com (Tracker 4G professionali)
- **Teltonika**: https://teltonika-gps.com (Enterprise grade)
- **Coban**: https://www.coban-gps.com (Economici per iniziare)

### Piattaforme Cloud GPS
- **GPS-Trace**: https://gps-trace.com
- **ThingsBoard**: https://thingsboard.io (Open source)
- **AWS IoT Core**: https://aws.amazon.com/iot-core

## Costi Operativi

### Setup Iniziale (2 bici)
- Hardware GPS: €100-300
- Installazione: €50-100
- **Totale**: €150-400

### Mensili
- SIM cards dati (2x): €10-20/mese
- Hosting cloud: €0-10/mese (se usi servizi esterni)
- **Totale**: €10-30/mese

## Alternative Economiche

Se il budget è limitato:

1. **Inizia senza GPS**: Il sistema funziona comunque, raccogli solo inizio/fine noleggio
2. **GPS solo su una bici**: Testa con una bici prima di investire
3. **Usa app mobile**: Chiedi agli utenti di installare un'app di tracking (meno affidabile)

## Prossimi Passi

1. Scegli hardware GPS adatto al budget
2. Ordina 1-2 dispositivi per test
3. Configura e testa in ambiente locale
4. Implementa visualizzazione mappa
5. Espandi a tutte le biciclette
