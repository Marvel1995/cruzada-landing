// La función handler que Vercel ejecutará
module.exports = async (req, res) => {
    // 1. Verificar que la petición sea POST y que tenga datos
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { nombre, telefono, pedido } = req.body;

    if (!nombre || !telefono) {
        return res.status(400).json({ error: 'Nombre y Teléfono son requeridos.' });
    }

    // En api/telegram.js

// --- CONFIGURACIÓN DE TELEGRAM (USANDO VARIABLES DE ENTORNO) ---
// Vercel inyectará estas variables en producción
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN; 
const TELEGRAM_CHAT_ID = process.env.CHAT_ID;
// ----------------------------------------------------

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    // Esto previene que se despliegue si faltan las variables
    return res.status(500).json({ error: 'Faltan credenciales de Telegram en Vercel.' });
}
// ... el resto del código ...

    // 2. Formato del mensaje a enviar
  const message = `✨ **NUEVA PETICIÓN DE ORACIÓN** ✨\n\n` +
                `👤 *Nombre:* ${nombre}\n` +
                `📞 *Teléfono:* ${telefono}\n` +
                `🙏 **Petición:** ${pedido}\n\n` + // <-- ¡Añade esta línea!
                `#LibroDeOracion`;

    // 3. Crear la URL para la API de Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown', // Permite usar negritas y emojis en el mensaje
    };

    try {
        // 4. Enviar la petición a Telegram
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (response.ok) {
            // 5. Éxito
            res.status(200).json({ success: true, message: 'Datos enviados a Telegram' });
        } else {
            // 6. Error de Telegram
            console.error('Error de Telegram API:', data);
            res.status(500).json({ success: false, error: 'Error al enviar el mensaje a Telegram' });
        }
    } catch (error) {
        // 7. Error de red o interno
        console.error('Error en la función serverless:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};