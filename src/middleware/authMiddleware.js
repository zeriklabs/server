const admin = require('firebase-admin');

/**
 * Middleware para verificar el Firebase ID Token enviado en la cabecera Authorization.
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No autorizado. Debes proveer un token en la cabecera Authorization: Bearer <token>' 
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verificamos el token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Adjuntamos la información del usuario a la petición por si la necesitamos después
    req.user = decodedToken;
    
    // Continuamos a la siguiente función (el endpoint real)
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(403).json({ error: 'No autorizado. Token inválido o expirado.' });
  }
}

module.exports = verifyToken;
