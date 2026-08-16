const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const path = require('path');

// Inicializar Firebase Admin SDK
function initFirebase() {
  try {
    let serviceAccount;
    
    // Si estamos en producción (ej. Render), leemos el JSON desde una variable de entorno
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      // En entorno local, leemos el archivo físico
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
      serviceAccount = require(path.resolve(serviceAccountPath));
    }

    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado correctamente.');
  } catch (error) {
    console.error('Error inicializando Firebase Admin SDK:', error.message);
    console.error('Asegúrate de que la variable FIREBASE_SERVICE_ACCOUNT_JSON exista o el archivo de credenciales local sea válido.');
  }
}

/**
 * Envía una notificación a un Topic de FCM.
 * @param {string} topic - El nombre del topic (ej. grupo_123).
 * @param {object} payload - Los datos de la notificación.
 * @returns {Promise<string>} - ID del mensaje.
 */
async function sendNotificationToTopic(topic, payload) {
  try {
    const message = {
      data: payload,
      topic: topic,
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            priority: 10
          }
        }
      }
    };

    const response = await getMessaging().send(message);
    console.log(`Mensaje enviado exitosamente al topic ${topic}:`, response);
    return response;
  } catch (error) {
    console.error(`Error enviando mensaje al topic ${topic}:`, error);
    throw error;
  }
}

module.exports = {
  initFirebase,
  sendNotificationToTopic
};
