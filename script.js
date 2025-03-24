// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});

// Pricing toggle
const pricingToggleBtns = document.querySelectorAll('.pricing-toggle button');

pricingToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        pricingToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Logika zmiany cen miesięcznych na roczne
        const isAnnual = btn.textContent.includes('roczna');
        const pricingCards = document.querySelectorAll('.pricing-card');

        pricingCards.forEach(card => {
            const priceElement = card.querySelector('.pricing-price');
            let price = parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));

            if (isAnnual) {
                // Aplikuj zniżkę 15% dla płatności rocznej
                const annualPrice = Math.round(price * 0.85);
                priceElement.innerHTML = `${annualPrice} zł <span>/miesiąc</span><br><span style="font-size: 0.8rem;">przy płatności rocznej</span>`;
            } else {
                // Przywróć cenę miesięczną
                if (card.querySelector('h3').textContent === 'Standard') {
                    priceElement.innerHTML = '599 zł <span>/miesiąc</span>';
                } else if (card.querySelector('h3').textContent === 'Professional') {
                    priceElement.innerHTML = '1499 zł <span>/miesiąc</span>';
                } else {
                    priceElement.innerHTML = '3999 zł <span>/miesiąc</span>';
                }
            }
        });
    });
});

// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;

        question.classList.toggle('active');

        if (question.classList.contains('active')) {
            answer.classList.add('active');
        } else {
            answer.classList.remove('active');
        }
    });
});

// ROI Calculator
const calculateRoiBtn = document.getElementById('calculate-roi');
const roiResults = document.getElementById('roi-results');

calculateRoiBtn.addEventListener('click', () => {
    const cameras = parseInt(document.getElementById('cameras').value) || 0;
    const locations = parseInt(document.getElementById('locations').value) || 0;
    const maintenance = parseInt(document.getElementById('maintenance').value) || 0;
    const issues = parseInt(document.getElementById('issues').value) || 0;

    // Kalkulacja ROI
    const currentCosts = maintenance * 12 + issues * 500 * 12; // Zakładamy 500 PLN za problem
    const newCosts = (maintenance * 0.7 * 12) + (issues * 0.4 * 500 * 12); // 30% redukcji kosztów utrzymania, 60% mniej problemów
    const savings = currentCosts - newCosts;
    const reducedVisits = 60; // 60% redukcji wizyt serwisowych

    // Obliczanie ROI w miesiącach
    let monthlyCost = 0;
    if (cameras <= 10) {
        monthlyCost = 599;
    } else if (cameras <= 50) {
        monthlyCost = 1499;
    } else {
        monthlyCost = 3999;
    }

    const annualCost = monthlyCost * 12;
    const roiMonths = Math.ceil((annualCost / savings) * 12);

    // Aktualizacja wyników
    document.getElementById('current-costs').textContent = currentCosts.toLocaleString() + ' PLN';
    document.getElementById('new-costs').textContent = newCosts.toLocaleString() + ' PLN';
    document.getElementById('savings').textContent = savings.toLocaleString() + ' PLN';
    document.getElementById('reduced-visits').textContent = reducedVisits + '%';
    document.getElementById('roi-months').textContent = roiMonths + ' miesięcy';

    roiResults.classList.add('active');

    // Animowane przewijanie do wyników
    roiResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Obsługa formularza kontaktowego
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Tutaj normalnie byłaby obsługa formularza przez AJAX
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (nameInput.value && emailInput.value && messageInput.value) {
            alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
            contactForm.reset();
        }
    });
}

// Efekt przewijania dla nagłówka
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animacja elementów na stronie przy przewijaniu
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .benefit-card, .step, .pricing-card');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    // Otwórz pierwszy element FAQ
    if (document.querySelector('.faq-question')) {
        document.querySelector('.faq-question').click();
    }

    // Ustaw minimalną datę dla kalendarza
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = tomorrow.toISOString().split('T')[0];
    });

    // Dodaj klasy CSS dla animacji elementów
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = (index * 0.1) + 's';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300);
    });

    // Dodaj efekt pojawiania się dla sekcji podczas przewijania
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');

                // Animuj elementy wewnątrz widocznej sekcji
                const animElements = entry.target.querySelectorAll('.benefit-card, .step, .pricing-card');
                animElements.forEach((elem, index) => {
                    setTimeout(() => {
                        elem.style.opacity = '1';
                        elem.style.transform = 'translateY(0)';
                    }, index * 150);
                });

                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.transition = 'opacity 0.5s ease';
        sectionObserver.observe(section);

        // Przygotuj elementy do animacji
        const animElements = section.querySelectorAll('.benefit-card, .step, .pricing-card');
        animElements.forEach(elem => {
            elem.style.opacity = '0';
            elem.style.transform = 'translateY(30px)';
            elem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    });

    // Inicjalizacja liczników dla statystyk
    function initCounters() {
        const stats = document.querySelectorAll('.benefit-stats');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            stat.textContent = '0';

            const incrementCounter = () => {
                const current = parseInt(stat.textContent);
                const increment = Math.ceil(target / 20);
                const newValue = Math.min(current + increment, target);

                stat.textContent = newValue;

                if (newValue < target) {
                    setTimeout(incrementCounter, 50);
                } else {
                    stat.textContent = target + '%';
                }
            };

            // Rozpocznij animację licznika gdy element jest widoczny
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(incrementCounter, 300);
                    statsObserver.unobserve(entries[0].target);
                }
            }, { threshold: 0.5 });

            statsObserver.observe(stat);
        });
    }

    // Uruchom liczniki
    initCounters();
});




/**
 * Funkcja dodająca interaktywne kalkulatory dla różnych modeli cenowych
 */
function initPricingCalculators() {
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        // Dodaj interaktywny kalkulator dla każdej karty cenowej
        const plan = card.querySelector('h3').textContent;
        const basePrice = parseInt(card.querySelector('.pricing-price').textContent);

        // Tworzenie kalkulatora
        const calculator = document.createElement('div');
        calculator.className = 'pricing-calculator';
        calculator.innerHTML = `
            <div class="calculator-toggle">
                <button type="button" class="btn btn-secondary btn-sm">Kalkulator szczegółowy</button>
            </div>
            <div class="calculator-form" style="display: none;">
                <div class="form-group">
                    <label>Liczba kamer</label>
                    <input type="range" min="1" max="100" value="10" class="form-control-range">
                    <span class="range-value">10</span>
                </div>
                <div class="form-group">
                    <label>Okres umowy (miesiące)</label>
                    <select class="form-control">
                        <option value="1">1 miesiąc</option>
                        <option value="6">6 miesięcy (- 5%)</option>
                        <option value="12" selected>12 miesięcy (- 15%)</option>
                        <option value="24">24 miesiące (- 20%)</option>
                    </select>
                </div>
                <div class="price-summary">
                    <p>Miesięczny koszt: <strong>${basePrice} PLN</strong></p>
                </div>
            </div>
        `;

        // Dodaj kalkulator po przyciskach
        const btn = card.querySelector('.btn');
        card.insertBefore(calculator, btn);

        // Obsługa pokazywania/ukrywania kalkulatora
        const toggle = calculator.querySelector('.calculator-toggle button');
        const form = calculator.querySelector('.calculator-form');

        toggle.addEventListener('click', () => {
            if (form.style.display === 'none') {
                form.style.display = 'block';
                toggle.textContent = 'Ukryj kalkulator';
            } else {
                form.style.display = 'none';
                toggle.textContent = 'Kalkulator szczegółowy';
            }
        });
    });
}

/**
 * Funkcja dodająca możliwość dynamicznego przełączania case studies
 */
function enhanceCaseStudies() {
    const caseStudiesContainer = document.querySelector('.case-studies-container');
    if (!caseStudiesContainer) return;

    const caseStudies = caseStudiesContainer.querySelectorAll('.case-study');
    if (caseStudies.length <= 1) return;

    // Dodaj przyciski nawigacyjne
    const navButtons = document.createElement('div');
    navButtons.className = 'case-study-nav text-center';
    navButtons.innerHTML = `
        <button class="btn btn-secondary case-prev"><i class="fas fa-arrow-left"></i> Poprzedni</button>
        <span class="case-counter">1/${caseStudies.length}</span>
        <button class="btn btn-secondary case-next">Następny <i class="fas fa-arrow-right"></i></button>
    `;

    caseStudiesContainer.parentNode.appendChild(navButtons);

    // Obsługa przycisków
    let currentCase = 0;
    const prevBtn = navButtons.querySelector('.case-prev');
    const nextBtn = navButtons.querySelector('.case-next');
    const counter = navButtons.querySelector('.case-counter');

    // Aktualizacja stanu
    function updateCaseDisplay() {
        counter.textContent = `${currentCase + 1}/${caseStudies.length}`;

        // Płynne przewijanie do aktualnego case study
        caseStudiesContainer.scrollTo({
            left: caseStudies[currentCase].offsetLeft - caseStudiesContainer.offsetLeft,
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => {
        currentCase = (currentCase > 0) ? currentCase - 1 : caseStudies.length - 1;
        updateCaseDisplay();
    });

    nextBtn.addEventListener('click', () => {
        currentCase = (currentCase < caseStudies.length - 1) ? currentCase + 1 : 0;
        updateCaseDisplay();
    });
}
