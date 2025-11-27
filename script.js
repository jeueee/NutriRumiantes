// Referencias a los elementos del DOM
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvasOverlay');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');

// Variables globales
let model;
const MODEL_SIZE = 300; // Tamaño de entrada del modelo

/**
 * 1. Inicializa la cámara web
 */
async function setupWebcam() {
    statusElement.innerText = 'Solicitando acceso a la cámara...';
    try {
        // Pide permiso para usar la cámara web
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Espera a que el video cargue los metadatos para obtener sus dimensiones
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                // Establece el tamaño del canvas igual al tamaño nativo del video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                statusElement.innerText = 'Cámara cargada. Cargando modelo COCO-SSD...';
                resolve(true);
            };
        });

    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        statusElement.innerText = 'Error: No se pudo acceder a la cámara web.';
    }
}

/**
 * 2. Carga el modelo de detección de objetos COCO-SSD
 */
async function loadModel() {
    // cocoSsd es un modelo pre-empaquetado de tfjs-models
    model = await cocoSsd.load();
    statusElement.innerText = 'Modelo cargado. ¡Detección iniciada!';
}

/**
 * 3. Bucle principal para la detección
 */
function detectFrame() {
    // Verifica si el video está listo y el modelo cargado
    if (model && video.readyState === 4) {
        // Ejecuta la detección en la imagen del video
        model.detect(video).then(predictions => {
            // Limpia el canvas para dibujar nuevos resultados
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dibuja las detecciones
            predictions.forEach(prediction => {
                // prediction.bbox es [x, y, ancho, alto]
                const [x, y, width, height] = prediction.bbox;

                // Dibuja el cuadro delimitador (Bounding Box)
                ctx.strokeStyle = '#00FFFF'; // Color cian
                ctx.lineWidth = 4;
                ctx.strokeRect(x, y, width, height);

                // Dibuja la etiqueta y la puntuación
                ctx.fillStyle = '#00FFFF';
                ctx.font = '24px Arial';
                const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
                
                // Fondo para el texto
                ctx.fillRect(x, y - 24, ctx.measureText(text).width + 8, 24);
                
                // Texto de la predicción
                ctx.fillStyle = '#000000'; // Texto negro
                ctx.fillText(text, x + 4, y - 4);
            });

            // Llama a sí misma en el siguiente cuadro de animación para continuar la detección
            requestAnimationFrame(detectFrame);
        });
    } else {
        // Si el modelo no ha cargado, sigue esperando
        requestAnimationFrame(detectFrame);
    }
}

/**
 * 4. Función de inicio
 */
async function init() {
    await setupWebcam(); // Inicia la cámara
    await loadModel();   // Carga el modelo
    detectFrame();       // Inicia el bucle de detección
}

// Inicia la aplicación cuando el script se carga
init();