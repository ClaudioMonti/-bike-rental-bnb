// Booking page JavaScript

let currentStep = 1;
let userData = null;
let bookingData = null;
let stripe = null;
let elements = null;
let paymentElement = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Inizializza Stripe
    stripe = Stripe(STRIPE_PUBLIC_KEY);

    // Carica dati per il form
    await loadBikesForBooking();
    await loadPricingForBooking();

    // Setup form listeners
    document.getElementById('user-form').addEventListener('submit', handleUserForm);
    document.getElementById('booking-form').addEventListener('submit', handleBookingForm);
    document.getElementById('submit-payment').addEventListener('click', handlePayment);

    // Listener per calcolare il prezzo
    document.getElementById('pricing_id').addEventListener('change', updatePriceDisplay);

    // Controlla se c'è un bike_id nell'URL
    const urlParams = new URLSearchParams(window.location.search);
    const bikeId = urlParams.get('bike');
    if (bikeId) {
        document.getElementById('bike_id').value = bikeId;
    }

    // Controlla se c'è un QR code nell'URL (per scansione QR)
    const qrCode = urlParams.get('qr');
    if (qrCode) {
        await handleQRCodeBooking(qrCode);
    }
});

// Carica bici disponibili
async function loadBikesForBooking() {
    try {
        const bikes = await getBikes();
        const select = document.getElementById('bike_id');

        bikes.forEach(bike => {
            if (bike.status === 'available') {
                const option = document.createElement('option');
                option.value = bike.id;
                option.textContent = `${bike.name} - ${bike.description}`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Errore caricamento bici:', error);
    }
}

// Carica tariffe
async function loadPricingForBooking() {
    try {
        const pricing = await getPricing();
        const select = document.getElementById('pricing_id');

        pricing.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${plan.name} - €${plan.price.toFixed(2)}`;
            option.dataset.price = plan.price;
            option.dataset.hours = plan.duration_hours;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Errore caricamento tariffe:', error);
    }
}

// Aggiorna display prezzo
function updatePriceDisplay() {
    const select = document.getElementById('pricing_id');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption && selectedOption.dataset.price) {
        const price = parseFloat(selectedOption.dataset.price);
        document.getElementById('price-display').textContent = `Totale: €${price.toFixed(2)}`;
    }
}

// Gestione QR Code
async function handleQRCodeBooking(qrCode) {
    try {
        const bikeData = await getBikeByQR(qrCode);

        if (!bikeData.isAvailable) {
            showAlert('Questa bicicletta non è disponibile al momento', 'error');
            return;
        }

        document.getElementById('bike_id').value = bikeData.id;
        showAlert(`Hai scannerizzato il QR di: ${bikeData.name}`, 'success');
    } catch (error) {
        console.error('Errore QR code:', error);
        showAlert('QR code non valido', 'error');
    }
}

// Step 1: Form utente
async function handleUserForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    userData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    // Registra o recupera utente
    try {
        let user = null;
        try {
            user = await getUserByEmail(userData.email);
        } catch {
            // Utente non esiste, crealo
            const result = await registerUser(userData);
            user = result.user;
        }

        userData.id = user.id;
        goToStep(2);

    } catch (error) {
        console.error('Errore registrazione utente:', error);
        showAlert('Errore nella registrazione. Riprova.', 'error');
    }
}

// Step 2: Form prenotazione
async function handleBookingForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Calcola estimated_end_time basato sulla tariffa
    const pricingSelect = document.getElementById('pricing_id');
    const selectedPricing = pricingSelect.options[pricingSelect.selectedIndex];
    const durationHours = parseInt(selectedPricing.dataset.hours);

    const startTime = new Date(formData.get('start_time'));
    const estimatedEndTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));

    const booking = {
        user_id: userData.id,
        bike_id: parseInt(formData.get('bike_id')),
        pricing_id: parseInt(formData.get('pricing_id')),
        start_time: startTime.toISOString(),
        estimated_end_time: estimatedEndTime.toISOString(),
        notes: formData.get('notes')
    };

    try {
        const result = await createBooking(booking);
        bookingData = result.booking;

        // Mostra riepilogo
        const bikeName = document.getElementById('bike_id').options[document.getElementById('bike_id').selectedIndex].text;
        const pricingName = selectedPricing.text;

        document.getElementById('booking-summary').innerHTML = `
            <h4>Riepilogo Prenotazione</h4>
            <p><strong>Bicicletta:</strong> ${bikeName}</p>
            <p><strong>Tariffa:</strong> ${pricingName}</p>
            <p><strong>Inizio:</strong> ${startTime.toLocaleString('it-IT')}</p>
            <p><strong>Totale:</strong> €${bookingData.total_price.toFixed(2)}</p>
        `;

        // Inizializza pagamento
        await initializePayment();

        goToStep(3);

    } catch (error) {
        console.error('Errore creazione prenotazione:', error);
        showAlert(error.message || 'Errore nella prenotazione. Riprova.', 'error');
    }
}

// Inizializza Stripe Payment
async function initializePayment() {
    try {
        const { clientSecret } = await createPaymentIntent(bookingData.id);

        elements = stripe.elements({ clientSecret });

        paymentElement = elements.create('payment', {
            layout: 'tabs'
        });

        paymentElement.mount('#payment-element');

    } catch (error) {
        console.error('Errore inizializzazione pagamento:', error);
        showAlert('Errore nell\'inizializzazione del pagamento', 'error');
    }
}

// Gestione pagamento
async function handlePayment() {
    const submitButton = document.getElementById('submit-payment');
    submitButton.disabled = true;
    submitButton.textContent = 'Elaborazione...';

    try {
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success.html?booking_id=${bookingData.id}`,
            },
            redirect: 'if_required'
        });

        if (error) {
            showPaymentMessage(error.message, 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Paga Ora';
        } else {
            // Pagamento completato
            showConfirmation();
        }

    } catch (error) {
        console.error('Errore pagamento:', error);
        showPaymentMessage('Errore nel pagamento', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Paga Ora';
    }
}

// Mostra conferma
function showConfirmation() {
    document.getElementById('confirmation-details').innerHTML = `
        <h4>Numero Prenotazione: #${bookingData.id}</h4>
        <p>Abbiamo inviato un'email di conferma a: ${userData.email}</p>
        <p>Presentati presso il nostro B&B all'orario indicato per ritirare la bicicletta.</p>
    `;

    goToStep(4);
}

// Mostra messaggio pagamento
function showPaymentMessage(message, type = 'error') {
    const messageDiv = document.getElementById('payment-message');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Navigazione tra gli step
function goToStep(stepNumber) {
    // Nascondi tutti gli step
    document.querySelectorAll('.booking-step').forEach(step => {
        step.style.display = 'none';
    });

    // Mostra lo step corrente
    document.getElementById(`step-${stepNumber}`).style.display = 'block';
    currentStep = stepNumber;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility per mostrare alert
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '1000';
    alert.style.minWidth = '300px';

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}
