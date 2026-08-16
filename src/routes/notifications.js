const express = require('express');
const router = express.Router();
const fcmService = require('../services/fcmService');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/notifications/group
// Ahora protegemos esta ruta con el middleware verifyToken
router.post('/group', verifyToken, async (req, res) => {
  const { topic, title, body, senderId, postId } = req.body;

  if (!topic || !title || !body) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos: topic, title o body.' });
  }

  try {
    const payload = {
      title,
      body,
      senderId: senderId || '',
      postId: postId || ''
    };

    const messageId = await fcmService.sendNotificationToTopic(topic, payload);
    
    res.status(200).json({
      success: true,
      message: 'Notificación enviada',
      messageId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno al enviar la notificación',
      details: error.message
    });
  }
});

module.exports = router;
