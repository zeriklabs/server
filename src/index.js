require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fcmService = require('./services/fcmService');
const notificationsRouter = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Firebase
fcmService.initFirebase();

// Rutas
app.use('/api/notifications', notificationsRouter);

// Endpoint de prueba
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor de notificaciones funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
