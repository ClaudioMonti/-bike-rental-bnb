// Traduzioni del sito
const translations = {
    it: {
        nav: {
            home: "Home",
            howItWorks: "Come Funziona",
            pricing: "Tariffe",
            contacts: "Contatti",
            payments: "Pagamenti",
            calendar: "Disponibilità",
            routes: "Percorsi",
            faq: "FAQ"
        },
        hero: {
            title: "Esplora la Toscana in bicicletta!",
            subtitle: "Noleggia una delle nostre biciclette e goditi la tua avventura"
        },
        howItWorks: {
            title: "Come Funziona",
            step1: {
                title: "Inquadra il QR Code",
                desc: "Scannerizza il QR code con il tuo smartphone per accedere alla prenotazione."
            },
            step2: {
                title: "Scegli la Tariffa",
                desc: "Seleziona la tariffa più adatta alle tue esigenze."
            },
            step3: {
                title: "Contatta Claudio",
                desc: "Contatta Claudio per accordarvi sulla scelta dell'offerta. I contatti si trovano in fondo alla pagina."
            },
            step4: {
                title: "Ricevi i Codici",
                desc: "Ti invieremo i codici per sbloccare le catene delle biciclette."
            },
            step5: {
                title: "Buon Divertimento!",
                desc: "Goditi la tua avventura in bicicletta!"
            }
        },
        pricing: {
            title: "Le Nostre Tariffe",
            plans: {
                "Mezza Giornata": "Mezza Giornata",
                "Giornata Intera": "Giornata Intera",
                "3 Giorni": "3 Giorni",
                "Settimanale": "Settimanale",
                "15 Giorni": "15 Giorni",
                "Mensile": "Mensile"
            },
            durations: {
                "4 ore": "4 ore",
                "24 ore": "24 ore",
                "3 giorni": "3 giorni",
                "7 giorni": "7 giorni",
                "15 giorni": "15 giorni",
                "30 giorni": "30 giorni"
            },
            perBikeNote: "* I prezzi si riferiscono al noleggio di una singola bicicletta."
        },
        bikes: {
            title: "Le Nostre Biciclette",
            names: {
                "Bici 1 - Mountain Bike": "Bici 1 - Mountain Bike",
                "Bici 2 - Mountain Bike": "Bici 2 - Mountain Bike"
            },
            descriptions: {
                "Mountain bike per percorsi avventurosi": "Mountain bike per percorsi avventurosi",
                "Bicicletta da città comoda e veloce": "Bicicletta da città comoda e veloce"
            },
            status: {
                "Disponibile": "Disponibile",
                "Noleggiata": "Noleggiata",
                "In Manutenzione": "In Manutenzione"
            }
        },
        contacts: {
            title: "Contatti",
            subtitle: "Contattaci per prenotare o per qualsiasi informazione",
            phone: "Telefono",
            phoneApps: "WhatsApp, Telegram, SMS, Chiamate",
            airbnb: "Contattaci tramite la chat Airbnb"
        },
        cta: {
            title: "Pronto per la tua avventura in bicicletta?",
            subtitle: "Prenota ora e inizia a esplorare!"
        },
        payments: {
            title: "Metodi di Pagamento",
            subtitle: "Accettiamo le seguenti modalità di pagamento:",
            paypalAlt: "oppure invia a: claudiomonti9720@gmail.com",
            bankTransfer: "Bonifico Revolut",
            accountHolder: "Intestatario: Claudio Monti"
        },
        footer: {
            rights: "Tutti i diritti riservati.",
            contacts: "Contatti:"
        },
        gallery: {
            title: "Galleria",
            subtitle: "Scopri i meravigliosi paesaggi della Toscana",
            img1: "Colline Toscane",
            img2: "Percorsi Panoramici",
            img3: "Le Nostre Bici",
            img4: "Tramonti Magici",
            img5: "Vigneti e Natura",
            img6: "Avventura su Due Ruote"
        },
        calendar: {
            title: "Disponibilità",
            subtitle: "Verifica quando le biciclette sono disponibili",
            available: "Disponibile",
            booked: "Prenotata"
        },
        routes: {
            title: "Percorsi Consigliati",
            subtitle: "Esplora i migliori itinerari della Toscana",
            route1: {
                name: "Montecatini Terme e Alto",
                desc: "Terme storiche e borgo medievale panoramico",
                time: "⏱️ 1-2 ore",
                level: "📈 Media"
            },
            route2: {
                name: "Padule di Fucecchio",
                desc: "Riserva naturale e birdwatching",
                time: "⏱️ 1-2 ore",
                level: "📈 Facile"
            },
            route3: {
                name: "Lucca e le Mura",
                desc: "Città d'arte e mura rinascimentali",
                time: "⏱️ 2-3 ore",
                level: "📈 Facile"
            }
        },
        faq: {
            title: "Domande Frequenti",
            q1: "Il casco è incluso nel noleggio?",
            a1: "Sì, il casco è incluso gratuitamente nel noleggio. La sicurezza è la nostra priorità!",
            q2: "Quali sono gli orari di ritiro e consegna?",
            a2: "Gli orari sono flessibili e da concordare direttamente con Claudio.",
            q3: "Chi è responsabile delle biciclette?",
            a3: "Il cliente è responsabile della bicicletta durante il noleggio. Eventuali danni o furti saranno a carico del cliente.",
            q5: "Sono inclusi lucchetto e luci?",
            a5: "Sì, ogni bicicletta è dotata di lucchetto con codice e luci anteriori e posteriori."
        },
        agreement: {
            title: "Contratto di Noleggio Bicicletta",
            subtitle: "Accordo tra il proprietario e l'ospite per il servizio di noleggio biciclette",
            openButton: "Firma il Contratto",
            art1: {
                title: "Art. 1 - Oggetto del Contratto",
                text: "Il presente accordo regola il noleggio di una o piu' biciclette messe a disposizione dal proprietario della struttura ricettiva (di seguito \"Proprietario\") all'ospite (di seguito \"Cliente\") per uso ricreativo e personale durante il periodo di soggiorno."
            },
            art2: {
                title: "Art. 2 - Obblighi del Cliente",
                item1: "Utilizzare la bicicletta con diligenza e nel rispetto del Codice della Strada",
                item2: "Indossare il casco protettivo fornito durante l'utilizzo",
                item3: "Restituire la bicicletta nelle stesse condizioni in cui e' stata ricevuta",
                item4: "Non cedere la bicicletta a terzi",
                item5: "Utilizzare il lucchetto fornito per assicurare la bicicletta durante le soste",
                item6: "Comunicare tempestivamente al Proprietario qualsiasi anomalia o danno"
            },
            art3: {
                title: "Art. 3 - Responsabilita'",
                text: "Il Cliente e' responsabile della bicicletta dal momento del ritiro fino alla riconsegna. Eventuali danni, furti o smarrimenti saranno a carico del Cliente. Il Proprietario declina ogni responsabilita' per infortuni o danni a terzi causati durante l'utilizzo della bicicletta."
            },
            art4: {
                title: "Art. 4 - Tariffe e Pagamento",
                text: "Il costo del noleggio e' stabilito secondo il tariffario in vigore e deve essere corrisposto al momento del ritiro della bicicletta o tramite i metodi di pagamento indicati (PayPal, bonifico Revolut). Il Cliente deve inoltre inviare una foto di un documento di identita' in corso di validita'."
            },
            art5: {
                title: "Art. 5 - Restituzione",
                text: "La bicicletta deve essere restituita entro l'orario concordato. Eventuali ritardi nella riconsegna comporteranno l'addebito della tariffa giornaliera aggiuntiva."
            },
            art6: {
                title: "Art. 6 - Danni e Penali",
                item1: "Danni lievi (graffi, usura anomala): addebito fino a 50 EUR",
                item2: "Danni gravi (rottura componenti): addebito fino a 150 EUR",
                item3: "Furto o smarrimento: addebito di 500 EUR"
            },
            art7: {
                title: "Art. 7 - Condizioni di Validita'",
                text: "Il noleggio e' subordinato alla firma del presente contratto da parte del Cliente e al contestuale pagamento dell'importo dovuto. Il contratto firmato deve essere inviato al Proprietario prima del ritiro della bicicletta."
            },
            firstName: "Nome",
            lastName: "Cognome",
            date: "Data",
            signatureTitle: "Firma del Cliente",
            signaturePlaceholder: "Firma qui con il dito o il mouse",
            clearSignature: "Cancella firma",
            acceptTerms: "Dichiaro di aver letto, compreso e accettato tutte le condizioni del presente contratto di noleggio. Mi impegno a rispettare le regole sopra indicate e ad assumermi la responsabilita' della bicicletta durante il periodo di utilizzo. Mi impegno inoltre a rinviare il presente contratto firmato unitamente al pagamento.",
            submit: "Firma e Scarica PDF",
            successTitle: "Contratto Firmato!",
            successText: "Il PDF e' stato scaricato. Ricorda di inviarlo firmato al proprietario insieme al pagamento!",
            closeSuccess: "Chiudi"
        }
    },
    en: {
        nav: {
            home: "Home",
            howItWorks: "How It Works",
            pricing: "Pricing",
            contacts: "Contacts",
            payments: "Payments",
            calendar: "Availability",
            routes: "Routes",
            faq: "FAQ"
        },
        hero: {
            title: "Explore Tuscany by bike!",
            subtitle: "Rent one of our bicycles and enjoy your adventure"
        },
        howItWorks: {
            title: "How It Works",
            step1: {
                title: "Scan the QR Code",
                desc: "Scan the QR code with your smartphone to access the booking."
            },
            step2: {
                title: "Choose Your Rate",
                desc: "Select the rate that best suits your needs."
            },
            step3: {
                title: "Contact Claudio",
                desc: "Contact Claudio to agree on your choice. Contact details are at the bottom of the page."
            },
            step4: {
                title: "Receive the Codes",
                desc: "We will send you the codes to unlock the bicycle chains."
            },
            step5: {
                title: "Have Fun!",
                desc: "Enjoy your bike adventure!"
            }
        },
        pricing: {
            title: "Our Rates",
            plans: {
                "Mezza Giornata": "Half Day",
                "Giornata Intera": "Full Day",
                "3 Giorni": "3 Days",
                "Settimanale": "Weekly",
                "15 Giorni": "15 Days",
                "Mensile": "Monthly"
            },
            durations: {
                "4 ore": "4 hours",
                "24 ore": "24 hours",
                "3 giorni": "3 days",
                "7 giorni": "7 days",
                "15 giorni": "15 days",
                "30 giorni": "30 days"
            },
            perBikeNote: "* Prices refer to the rental of a single bike."
        },
        bikes: {
            title: "Our Bikes",
            names: {
                "Bici 1 - Mountain Bike": "Bike 1 - Mountain Bike",
                "Bici 2 - Mountain Bike": "Bike 2 - Mountain Bike"
            },
            descriptions: {
                "Mountain bike per percorsi avventurosi": "Mountain bike for adventurous trails",
                "Bicicletta da città comoda e veloce": "Comfortable and fast city bike"
            },
            status: {
                "Disponibile": "Available",
                "Noleggiata": "Rented",
                "In Manutenzione": "Under Maintenance"
            }
        },
        contacts: {
            title: "Contacts",
            subtitle: "Contact us to book or for any information",
            phone: "Phone",
            phoneApps: "WhatsApp, Telegram, SMS, Calls",
            airbnb: "Contact us via Airbnb chat"
        },
        cta: {
            title: "Ready for your bike adventure?",
            subtitle: "Book now and start exploring!"
        },
        payments: {
            title: "Payment Methods",
            subtitle: "We accept the following payment methods:",
            paypalAlt: "or send to: claudiomonti9720@gmail.com",
            bankTransfer: "Revolut Bank Transfer",
            accountHolder: "Account holder: Claudio Monti"
        },
        footer: {
            rights: "All rights reserved.",
            contacts: "Contacts:"
        },
        gallery: {
            title: "Gallery",
            subtitle: "Discover the wonderful landscapes of Tuscany",
            img1: "Tuscan Hills",
            img2: "Scenic Routes",
            img3: "Our Bikes",
            img4: "Magical Sunsets",
            img5: "Vineyards & Nature",
            img6: "Adventure on Two Wheels"
        },
        calendar: {
            title: "Availability",
            subtitle: "Check when bikes are available",
            available: "Available",
            booked: "Booked"
        },
        routes: {
            title: "Recommended Routes",
            subtitle: "Explore the best itineraries in Tuscany",
            route1: {
                name: "Montecatini Terme & Alto",
                desc: "Historic thermal baths and panoramic medieval village",
                time: "⏱️ 1-2 hours",
                level: "📈 Medium"
            },
            route2: {
                name: "Fucecchio Marshes",
                desc: "Nature reserve and birdwatching",
                time: "⏱️ 1-2 hours",
                level: "📈 Easy"
            },
            route3: {
                name: "Lucca and the Walls",
                desc: "City of art and Renaissance walls",
                time: "⏱️ 2-3 hours",
                level: "📈 Easy"
            }
        },
        faq: {
            title: "Frequently Asked Questions",
            q1: "Is the helmet included in the rental?",
            a1: "Yes, the helmet is included for free. Safety is our priority!",
            q2: "What are the pick-up and drop-off times?",
            a2: "Times are flexible and to be agreed directly with Claudio.",
            q3: "Who is responsible for the bicycles?",
            a3: "The customer is responsible for the bicycle during the rental. Any damages or theft will be charged to the customer.",
            q5: "Are lock and lights included?",
            a5: "Yes, each bicycle comes with a combination lock and front and rear lights."
        },
        agreement: {
            title: "Bicycle Rental Agreement",
            subtitle: "Agreement between the owner and the guest for the bicycle rental service",
            openButton: "Sign the Agreement",
            art1: {
                title: "Art. 1 - Subject of the Agreement",
                text: "This agreement governs the rental of one or more bicycles made available by the owner of the accommodation (hereinafter \"Owner\") to the guest (hereinafter \"Customer\") for recreational and personal use during the stay."
            },
            art2: {
                title: "Art. 2 - Customer Obligations",
                item1: "Use the bicycle with due care and in compliance with traffic regulations",
                item2: "Wear the protective helmet provided during use",
                item3: "Return the bicycle in the same conditions as received",
                item4: "Do not lend the bicycle to third parties",
                item5: "Use the provided lock to secure the bicycle during stops",
                item6: "Promptly inform the Owner of any malfunction or damage"
            },
            art3: {
                title: "Art. 3 - Liability",
                text: "The Customer is responsible for the bicycle from the moment of collection until return. Any damage, theft, or loss will be charged to the Customer. The Owner disclaims any liability for injuries or damage to third parties caused during the use of the bicycle."
            },
            art4: {
                title: "Art. 4 - Rates and Payment",
                text: "The rental cost is established according to the current price list and must be paid at the time of bicycle collection or through the indicated payment methods (PayPal, Revolut bank transfer). The Customer must also send a photo of a valid identity document."
            },
            art5: {
                title: "Art. 5 - Return",
                text: "The bicycle must be returned by the agreed time. Any delays in return will result in an additional daily rate charge."
            },
            art6: {
                title: "Art. 6 - Damages and Penalties",
                item1: "Minor damage (scratches, abnormal wear): charge up to EUR 50",
                item2: "Major damage (broken components): charge up to EUR 150",
                item3: "Theft or loss: charge of EUR 500"
            },
            art7: {
                title: "Art. 7 - Conditions of Validity",
                text: "The rental is subject to the signing of this agreement by the Customer and the simultaneous payment of the amount due. The signed agreement must be sent to the Owner before collecting the bicycle."
            },
            firstName: "First Name",
            lastName: "Last Name",
            date: "Date",
            signatureTitle: "Customer Signature",
            signaturePlaceholder: "Sign here with your finger or mouse",
            clearSignature: "Clear signature",
            acceptTerms: "I declare that I have read, understood and accepted all the conditions of this rental agreement. I commit to following the rules stated above and to taking responsibility for the bicycle during the rental period. I also commit to returning this signed agreement together with the payment.",
            submit: "Sign and Download PDF",
            successTitle: "Agreement Signed!",
            successText: "The PDF has been downloaded. Remember to send it signed to the owner together with the payment!",
            closeSuccess: "Close"
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            howItWorks: "Comment ça marche",
            pricing: "Tarifs",
            contacts: "Contacts",
            payments: "Paiements",
            calendar: "Disponibilités",
            routes: "Itinéraires",
            faq: "FAQ"
        },
        hero: {
            title: "Explorez la Toscane à vélo !",
            subtitle: "Louez l'un de nos vélos et profitez de votre aventure"
        },
        howItWorks: {
            title: "Comment ça marche",
            step1: {
                title: "Scannez le QR Code",
                desc: "Scannez le QR code avec votre smartphone pour accéder à la réservation."
            },
            step2: {
                title: "Choisissez votre tarif",
                desc: "Sélectionnez le tarif qui correspond le mieux à vos besoins."
            },
            step3: {
                title: "Contactez Claudio",
                desc: "Contactez Claudio pour vous mettre d'accord sur votre choix. Les coordonnées se trouvent en bas de la page."
            },
            step4: {
                title: "Recevez les codes",
                desc: "Nous vous enverrons les codes pour déverrouiller les cadenas des vélos."
            },
            step5: {
                title: "Bonne aventure !",
                desc: "Profitez de votre aventure à vélo !"
            }
        },
        pricing: {
            title: "Nos Tarifs",
            plans: {
                "Mezza Giornata": "Demi-journée",
                "Giornata Intera": "Journée complète",
                "3 Giorni": "3 jours",
                "Settimanale": "Hebdomadaire",
                "15 Giorni": "15 jours",
                "Mensile": "Mensuel"
            },
            durations: {
                "4 ore": "4 heures",
                "24 ore": "24 heures",
                "3 giorni": "3 jours",
                "7 giorni": "7 jours",
                "15 giorni": "15 jours",
                "30 giorni": "30 jours"
            },
            perBikeNote: "* Les prix correspondent à la location d'un seul vélo."
        },
        bikes: {
            title: "Nos Vélos",
            names: {
                "Bici 1 - Mountain Bike": "Vélo 1 - VTT",
                "Bici 2 - Mountain Bike": "Vélo 2 - VTT"
            },
            descriptions: {
                "Mountain bike per percorsi avventurosi": "VTT pour les sentiers aventureux",
                "Bicicletta da città comoda e veloce": "Vélo de ville confortable et rapide"
            },
            status: {
                "Disponibile": "Disponible",
                "Noleggiata": "Loué",
                "In Manutenzione": "En maintenance"
            }
        },
        contacts: {
            title: "Contacts",
            subtitle: "Contactez-nous pour réserver ou pour toute information",
            phone: "Téléphone",
            phoneApps: "WhatsApp, Telegram, SMS, Appels",
            airbnb: "Contactez-nous via le chat Airbnb"
        },
        cta: {
            title: "Prêt pour votre aventure à vélo ?",
            subtitle: "Réservez maintenant et commencez à explorer !"
        },
        payments: {
            title: "Modes de Paiement",
            subtitle: "Nous acceptons les modes de paiement suivants :",
            paypalAlt: "ou envoyez à : claudiomonti9720@gmail.com",
            bankTransfer: "Virement Revolut",
            accountHolder: "Titulaire : Claudio Monti"
        },
        footer: {
            rights: "Tous droits réservés.",
            contacts: "Contacts :"
        },
        gallery: {
            title: "Galerie",
            subtitle: "Découvrez les merveilleux paysages de la Toscane",
            img1: "Collines Toscanes",
            img2: "Itinéraires panoramiques",
            img3: "Nos Vélos",
            img4: "Couchers de soleil magiques",
            img5: "Vignobles et Nature",
            img6: "Aventure sur deux roues"
        },
        calendar: {
            title: "Disponibilités",
            subtitle: "Vérifiez quand les vélos sont disponibles",
            available: "Disponible",
            booked: "Réservé"
        },
        routes: {
            title: "Itinéraires Conseillés",
            subtitle: "Explorez les meilleurs parcours de Toscane",
            route1: {
                name: "Montecatini Terme et Alto",
                desc: "Thermes historiques et village médiéval panoramique",
                time: "⏱️ 1-2 heures",
                level: "📈 Moyen"
            },
            route2: {
                name: "Marais de Fucecchio",
                desc: "Réserve naturelle et observation des oiseaux",
                time: "⏱️ 1-2 heures",
                level: "📈 Facile"
            },
            route3: {
                name: "Lucques et les Remparts",
                desc: "Ville d'art et remparts de la Renaissance",
                time: "⏱️ 2-3 heures",
                level: "📈 Facile"
            }
        },
        faq: {
            title: "Questions Fréquentes",
            q1: "Le casque est-il inclus dans la location ?",
            a1: "Oui, le casque est inclus gratuitement. La sécurité est notre priorité !",
            q2: "Quels sont les horaires de retrait et de restitution ?",
            a2: "Les horaires sont flexibles et à convenir directement avec Claudio.",
            q3: "Qui est responsable des vélos ?",
            a3: "Le client est responsable du vélo pendant la location. Tout dommage ou vol sera à la charge du client.",
            q5: "Le cadenas et les lumières sont-ils inclus ?",
            a5: "Oui, chaque vélo est équipé d'un cadenas à code et de lumières avant et arrière."
        },
        agreement: {
            title: "Contrat de Location de Vélo",
            subtitle: "Accord entre le propriétaire et le client pour le service de location de vélos",
            openButton: "Signer le Contrat",
            art1: {
                title: "Art. 1 - Objet du Contrat",
                text: "Le présent accord régit la location d'un ou plusieurs vélos mis à disposition par le propriétaire de l'hébergement (ci-après \"Propriétaire\") au client (ci-après \"Client\") pour un usage récréatif et personnel pendant le séjour."
            },
            art2: {
                title: "Art. 2 - Obligations du Client",
                item1: "Utiliser le vélo avec soin et dans le respect du code de la route",
                item2: "Porter le casque de protection fourni pendant l'utilisation",
                item3: "Restituer le vélo dans les mêmes conditions que lors de la réception",
                item4: "Ne pas prêter le vélo à des tiers",
                item5: "Utiliser le cadenas fourni pour sécuriser le vélo pendant les arrêts",
                item6: "Informer rapidement le Propriétaire de tout dysfonctionnement ou dommage"
            },
            art3: {
                title: "Art. 3 - Responsabilité",
                text: "Le Client est responsable du vélo depuis le moment de la prise en charge jusqu'à la restitution. Tout dommage, vol ou perte sera à la charge du Client. Le Propriétaire décline toute responsabilité pour les blessures ou dommages causés à des tiers lors de l'utilisation du vélo."
            },
            art4: {
                title: "Art. 4 - Tarifs et Paiement",
                text: "Le coût de la location est établi selon le tarif en vigueur et doit être réglé au moment du retrait du vélo ou via les méthodes de paiement indiquées (PayPal, virement Revolut). Le Client doit également envoyer une photo d'une pièce d'identité en cours de validité."
            },
            art5: {
                title: "Art. 5 - Restitution",
                text: "Le vélo doit être restitué à l'heure convenue. Tout retard dans la restitution entraînera la facturation d'un tarif journalier supplémentaire."
            },
            art6: {
                title: "Art. 6 - Dommages et Pénalités",
                item1: "Dommages légers (égratignures, usure anormale) : facturation jusqu'à 50 EUR",
                item2: "Dommages graves (composants cassés) : facturation jusqu'à 150 EUR",
                item3: "Vol ou perte : facturation de 500 EUR"
            },
            art7: {
                title: "Art. 7 - Conditions de Validité",
                text: "La location est subordonnée à la signature du présent contrat par le Client et au paiement simultané du montant dû. Le contrat signé doit être envoyé au Propriétaire avant le retrait du vélo."
            },
            firstName: "Prénom",
            lastName: "Nom",
            date: "Date",
            signatureTitle: "Signature du Client",
            signaturePlaceholder: "Signez ici avec votre doigt ou votre souris",
            clearSignature: "Effacer la signature",
            acceptTerms: "Je déclare avoir lu, compris et accepté toutes les conditions du présent contrat de location. Je m'engage à respecter les règles indiquées ci-dessus et à prendre la responsabilité du vélo pendant la période de location. Je m'engage également à retourner ce contrat signé accompagné du paiement.",
            submit: "Signer et Télécharger le PDF",
            successTitle: "Contrat Signé !",
            successText: "Le PDF a été téléchargé. N'oubliez pas de l'envoyer signé au propriétaire avec le paiement !",
            closeSuccess: "Fermer"
        }
    }
};

// Lingua corrente (default: italiano)
let currentLang = localStorage.getItem('lang') || 'it';

// Funzione per ottenere una traduzione da una chiave tipo "nav.home"
function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    return value;
}

// Funzione per applicare le traduzioni alla pagina
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Aggiorna i pulsanti lingua (evidenzia quello attivo)
    const langIt = document.getElementById('lang-it');
    const langEn = document.getElementById('lang-en');
    const langFr = document.getElementById('lang-fr');

    [langIt, langEn, langFr].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('lang-' + currentLang);
    if (activeBtn) activeBtn.classList.add('active');

    // Aggiorna l'attributo lang dell'HTML
    document.documentElement.lang = currentLang;
}

// Funzione per cambiare lingua
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', currentLang);
    applyTranslations();

    // Refresh dynamic content (pricing, bikes)
    if (typeof refreshDynamicContent === 'function') {
        refreshDynamicContent();
    }
}

// ==================== THEME MANAGEMENT ====================
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Applica le traduzioni iniziali
    applyTranslations();

    // Applica il tema salvato
    applyTheme();

    // Aggiungi listener ai pulsanti lingua
    const langIt = document.getElementById('lang-it');
    const langEn = document.getElementById('lang-en');
    const langFr = document.getElementById('lang-fr');

    if (langIt) langIt.addEventListener('click', () => setLanguage('it'));
    if (langEn) langEn.addEventListener('click', () => setLanguage('en'));
    if (langFr) langFr.addEventListener('click', () => setLanguage('fr'));

    // Aggiungi listener al toggle tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
