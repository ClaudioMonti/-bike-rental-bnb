// Main JavaScript per la home page

// Store data globally for re-rendering on language change
let pricingData = [];
let bikesData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadPricing();
    await loadBikes();
});

// Helper function to get translated text
function t(key) {
    return getTranslation(key) || key;
}

// Helper to translate plan names
function translatePlanName(name) {
    const translation = getTranslation(`pricing.plans.${name}`);
    return translation || name;
}

// Helper to translate duration text
function translateDuration(durationText) {
    const translation = getTranslation(`pricing.durations.${durationText}`);
    return translation || durationText;
}

// Helper to translate bike names
function translateBikeName(name) {
    const translation = getTranslation(`bikes.names.${name}`);
    return translation || name;
}

// Helper to translate bike descriptions
function translateBikeDescription(desc) {
    const translation = getTranslation(`bikes.descriptions.${desc}`);
    return translation || desc;
}

// Helper to translate bike status
function translateBikeStatus(status) {
    const translation = getTranslation(`bikes.status.${status}`);
    return translation || status;
}

// Carica le tariffe
async function loadPricing() {
    try {
        const pricingList = document.getElementById('pricing-list');
        if (!pricingList) return;

        pricingList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        pricingData = await getPricing();
        renderPricing();

    } catch (error) {
        console.error('Errore caricamento tariffe:', error);
        document.getElementById('pricing-list').innerHTML =
            '<div class="alert alert-error">Errore nel caricamento delle tariffe</div>';
    }
}

// Render pricing cards with translations
function renderPricing() {
    const pricingList = document.getElementById('pricing-list');
    if (!pricingList || !pricingData.length) return;

    pricingList.innerHTML = '';

    pricingData.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'pricing-card';

        let durationText = '';
        if (plan.duration_hours === 1) {
            durationText = "All'ora";
        } else if (plan.duration_hours === 4) {
            durationText = '4 ore';
        } else if (plan.duration_hours === 24) {
            durationText = '24 ore';
        } else if (plan.duration_hours === 168) {
            durationText = '7 giorni';
        } else if (plan.duration_hours === 360) {
            durationText = '15 giorni';
        } else if (plan.duration_hours === 720) {
            durationText = '30 giorni';
        }

        const translatedName = translatePlanName(plan.name);
        const translatedDuration = translateDuration(durationText);

        card.innerHTML = `
            <h3>${translatedName}</h3>
            <div class="price">€${plan.price.toFixed(2)}</div>
            <div class="duration">${translatedDuration}</div>
        `;

        pricingList.appendChild(card);
    });
}

// Carica le biciclette
async function loadBikes() {
    try {
        const bikesList = document.getElementById('bikes-list');
        if (!bikesList) return;

        bikesList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        bikesData = await getBikes();
        renderBikes();

    } catch (error) {
        console.error('Errore caricamento bici:', error);
        document.getElementById('bikes-list').innerHTML =
            '<div class="alert alert-error">Errore nel caricamento delle biciclette</div>';
    }
}

// Render bikes with translations
function renderBikes() {
    const bikesList = document.getElementById('bikes-list');
    if (!bikesList || !bikesData.length) return;

    bikesList.innerHTML = '';

    bikesData.forEach(bike => {
        const card = document.createElement('div');
        card.className = 'bike-card';

        const statusClass = bike.status === 'available' ? 'available' : 'rented';
        const statusTextIt = bike.status === 'available' ? 'Disponibile' :
                          bike.status === 'rented' ? 'Noleggiata' : 'In Manutenzione';

        const translatedName = translateBikeName(bike.name);
        const translatedDesc = translateBikeDescription(bike.description || 'Mountain bike per percorsi avventurosi');
        const translatedStatus = translateBikeStatus(statusTextIt);

        card.innerHTML = `
            <img src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400"
                 alt="${translatedName}">
            <div class="bike-info">
                <h3>${translatedName}</h3>
                <p>${translatedDesc}</p>
                <span class="bike-status ${statusClass}">${translatedStatus}</span>
            </div>
        `;

        bikesList.appendChild(card);
    });
}

// Re-render dynamic content when language changes
function refreshDynamicContent() {
    renderPricing();
    renderBikes();
}

// Utility per mostrare messaggi
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    document.body.insertBefore(alert, document.body.firstChild);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ==================== LIGHTBOX GALLERY ====================
const galleryImages = [
    'https://images.pexels.com/photos/5765657/pexels-photo-5765657.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5765658/pexels-photo-5765658.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1619773/pexels-photo-1619773.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5765653/pexels-photo-5765653.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

let currentSlide = 0;

function openLightbox(index) {
    currentSlide = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = galleryImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= galleryImages.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = galleryImages.length - 1;
    document.getElementById('lightbox-img').src = galleryImages[currentSlide];
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'ArrowLeft') changeSlide(-1);
});

// ==================== FAQ ACCORDION ====================
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't already open
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ==================== ROUTES MAP ====================
const routeMaps = {
    montecatini: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d30000!2d10.77!3d43.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e1!4m5!1s0x132a0331dbce7a55%3A0x4094f9b8db52ab0!2sChiesina%20Uzzanese%2C%20PT!3m2!1d43.839!2d10.72!4m5!1s0x132a02b85f26b3c3%3A0x698887e8e6f9f8af!2sMontecatini%20Alto%2C%20PT!3m2!1d43.8958!2d10.7417!5e0!3m2!1sit!2sit!4v1706000000000!5m2!1sit!2sit',
    padule: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46000!2d10.8!3d43.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a1234567890ab%3A0x1!2sPadule%20di%20Fucecchio!5e0!3m2!1sit!2sit!4v1706000000000!5m2!1sit!2sit',
    lucca: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d92419.08!2d10.55!3d43.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e1!4m5!1s0x132a0331dbce7a55%3A0x4094f9b8db52ab0!2sChiesina%20Uzzanese%2C%20PT!3m2!1d43.839!2d10.72!4m5!1s0x12d583d3c3f7a1d1%3A0x4094f9b8db52ab0!2sLucca!3m2!1d43.8376!2d10.4951!5e0!3m2!1sit!2sit!4v1706000000000!5m2!1sit!2sit'
};

function showRoute(routeId) {
    // Update active card
    document.querySelectorAll('.route-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Update map
    const mapFrame = document.getElementById('routes-map');
    if (mapFrame && routeMaps[routeId]) {
        mapFrame.src = routeMaps[routeId];
    }
}
