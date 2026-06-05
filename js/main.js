/**
 * RE | Ramirez & Elizalde - Script Principal
 * Lógica: Cotizador, Persistencia Local y Chatbot con Aprendizaje
 */

// 1. BASE DE CONOCIMIENTOS (Carga desde LocalStorage o inicializa por defecto)
let conocimiento = JSON.parse(localStorage.getItem('chat_memoria')) || {
    "hola": "¡Hola! Es un gusto saludarte. ¿En qué podemos ayudarte Fernando y Erick hoy?",
    "precio": "Nuestros precios son competitivos. Puedes usar el simulador de cotización que está arriba para una cifra base. 📈",
    "servicios": "Ofrecemos desarrollo web, móvil, ciberseguridad, automatización y soporte técnico.",
    "fernando": "Fernando Ramírez es especialista en Arquitectura de Software y Estrategia Digital.",
    "erick": "Erick Elizalde es experto en Implementación de Sistemas y Seguridad Informática.",
    "contacto": "Puedes llamarnos directamente: Fernando (3328076865) o Erick (3311445645).",
    "tiempo": "Un proyecto estándar suele entregarse en 2 a 4 semanas, dependiendo de la complejidad.",
    "seguridad": "Protegemos tu código con auditorías de vulnerabilidades y certificados SSL."
};

let ultimaPreguntaSinRespuesta = null;

// 2. NAVEGACIÓN
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 3. LÓGICA DEL COTIZADOR
function cotizar() {
    const select = document.getElementById('tipoWeb');
    const display = document.getElementById('resultado');
    const precio = select.value;
    
    // Formateo de moneda para MXN
    const formatoMoneda = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(precio);

    display.innerHTML = `Inversión estimada: <strong>${formatoMoneda}</strong>`;
}

// 4. GENERACIÓN DE PROPUESTA (Simulación de PDF)
function generarPDF() {
    const precio = document.getElementById('tipoWeb').value;
    const fecha = new Date().toLocaleDateString();
    
    const contenidoPropuesta = `
    =========================================
    PROPUESTA TÉCNICA - RE SOLUTIONS
    =========================================
    Fecha de emisión: ${fecha}
    
    Servicio: Desarrollo de solución digital
    Inversión estimada: $${precio} MXN
    
    Esta propuesta incluye:
    - Desarrollo optimizado (Clean Code)
    - Diseño Responsivo
    - Implementación de Seguridad Base
    
    Consultores Responsables:
    - Fernando Ramírez González
    - Erick Iván Elizalde Ortiz
    
    RE: Tecnología con criterio.
    =========================================`;

    const blob = new Blob([contenidoPropuesta], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Propuesta_RE_${fecha.replace(/\//g, '-')}.txt`;
    link.click();
}

// 5. LÓGICA DEL CHATBOT
function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();

    if (!text) return;

    // Mostrar mensaje del usuario
    agregarMensajeHTML(text, 'msg-user');
    input.value = "";

    // Simular "procesamiento" de la IA
    setTimeout(() => {
        let respuesta = "";
        const lowerText = text.toLowerCase();

        // Flujo de APRENDIZAJE: Si estábamos esperando una respuesta a una duda previa
        if (ultimaPreguntaSinRespuesta) {
            if (lowerText !== "nada" && lowerText !== "cancelar") {
                conocimiento[ultimaPreguntaSinRespuesta] = text; // Guardamos con el formato original
                localStorage.setItem('chat_memoria', JSON.stringify(conocimiento));
                respuesta = `¡Entendido! Ya aprendí qué responder cuando pregunten por "${ultimaPreguntaSinRespuesta}".`;
            } else {
                respuesta = "De acuerdo, omitiremos ese aprendizaje. ¿Qué más necesitas?";
            }
            ultimaPreguntaSinRespuesta = null;
        } 
        // Flujo de RESPUESTA NORMAL
        else {
            // Buscamos si alguna palabra clave de nuestro conocimiento está en lo que escribió el usuario
            const keyFound = Object.keys(conocimiento).find(key => lowerText.includes(key));

            if (keyFound) {
                respuesta = conocimiento[keyFound];
            } else {
                respuesta = `Aún no sé cómo responder a eso. ¿Qué debería decir cuando alguien pregunte por "${text}"? (Escribe la respuesta o 'nada')`;
                ultimaPreguntaSinRespuesta = lowerText;
            }
        }

        agregarMensajeHTML(respuesta, 'msg-bot');
    }, 600);
}

/**
 * Inserta burbujas de mensaje en el DOM
 */
function agregarMensajeHTML(texto, clase) {
    const chat = document.getElementById('chat');
    const bubble = document.createElement('div');
    
    bubble.className = clase;
    bubble.innerText = texto;
    
    chat.appendChild(bubble);
    
    // Scroll automático hacia abajo con suavidad
    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
    });
}

// Inicializar el cotizador al cargar la página
window.onload = cotizar;