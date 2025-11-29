// --- 1. CONFIGURACIÓN DEL CONTADOR REGRESIVO ---
// Fecha y hora del evento: 02 de diciembre, 7:00 PM (El año debe ser el actual o el siguiente, lo ajusto a 2025 ya que hoy es noviembre de 2025 en el contexto)
const eventDate = new Date("December 02, 2025 19:00:00").getTime(); 

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Obtener elementos del DOM
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Formato: Añadir un cero delante si el número es menor a 10
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    if (distance < 0) {
        // Si el tiempo ha terminado
        clearInterval(countdownInterval);
        daysEl.innerHTML = "00";
        hoursEl.innerHTML = "00";
        minutesEl.innerHTML = "00";
        secondsEl.innerHTML = "00";
        document.querySelector('.event-tagline').innerHTML = "¡EL EVENTO ESTÁ SUCEDIENDO AHORA!";
    } else {
        // Actualizar el HTML
        daysEl.innerHTML = formatTime(days);
        hoursEl.innerHTML = formatTime(hours);
        minutesEl.innerHTML = formatTime(minutes);
        secondsEl.innerHTML = formatTime(seconds);
    }
}


// Actualizar el contador cada segundo (1000ms)
const countdownInterval = setInterval(updateCountdown, 1000);

// Llamar a la función inmediatamente para evitar un retraso inicial
updateCountdown();


// --- 2. EFECTOS DE SCROLL DINÁMICO ---
document.addEventListener('DOMContentLoaded', () => {
    // 2.1. Efecto de aparición para la imagen del Obispo
    const obispoImage = document.querySelector('.obispo-image');

    // 2.2. Efecto Sticky (fijar) para el contador
    const headerContent = document.querySelector('.header-content');
    const countdownContainer = document.getElementById('countdown');
    
    // Función para manejar las animaciones y el 'sticky'
    function handleScrollEffects() {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;

        // ANIMACIÓN DEL OBISPO:
        // El obispo debe entrar cuando el usuario empieza a ver la sección
        const obispoSectionOffset = obispoImage.closest('.obispo-section').offsetTop;

        if (scrollPosition > (obispoSectionOffset - viewportHeight + 100)) {
            obispoImage.classList.add('is-visible');
        } else {
            obispoImage.classList.remove('is-visible');
        }

        // EFECTO STICKY DEL CONTADOR:
        // Hace que el contador se quede fijo en la parte superior después de hacer scroll
        // Esto crea el efecto "interactivo" de que te persigue al bajar.
        const headerBottom = headerContent.offsetTop + headerContent.offsetHeight;

        if (scrollPosition > headerBottom - countdownContainer.offsetHeight) {
            countdownContainer.classList.add('is-sticky');
        } else {
            countdownContainer.classList.remove('is-sticky');
        }
    }

    // Agregar el listener al evento scroll
    window.addEventListener('scroll', handleScrollEffects);
    // Ejecutar una vez al cargar por si la página se recarga en una posición baja
    handleScrollEffects();
});

// --- 3. MANEJO DEL FORMULARIO Y ENVÍO A TELEGRAM ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente del contador y scroll) ...

    const prayerForm = document.getElementById('prayer-form');
    
    prayerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita la recarga de la página

        const formData = new FormData(prayerForm);
        const data = Object.fromEntries(formData.entries());

        const submitButton = prayerForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // La URL de tu Serverless Function en Vercel será /api/telegram
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert('¡Gracias! Tu nombre y teléfono han sido añadidos al Libro de Oración.');
                prayerForm.reset(); // Limpia el formulario
            } else {
                alert('Error al enviar. Por favor, inténtalo de nuevo.');
                console.error('Error del servidor:', result.error);
            }
        } catch (error) {
            alert('Error de conexión. Revisa tu conexión a internet.');
            console.error('Error de red:', error);
        } finally {
            submitButton.textContent = 'Añadir al Libro de Oración';
            submitButton.disabled = false;
        }
    });

    // ... (código existente de scroll effects) ...
});