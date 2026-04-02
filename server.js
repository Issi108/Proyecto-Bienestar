const express = require('express');
const cors = require('cors');

// Importamos el archivo de la base de datos. 
// Al hacer esto, el código de database.js se ejecuta y crea el archivo .sqlite
const db = require('./src/db/database'); 
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES (Configuraciones base)
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a nuestro servidor entender los datos JSON que enviemos desde formularios
app.use('/api/auth', authRoutes); // Para usar rutas de autenticación de la API
app.use(express.static('public')); // Le dice a Express que sirva los archivos HTML/CSS de la carpeta public

// RUTA DE PRUEBA
// Si entramos a http://localhost:3000/api/estado, veremos este mensaje
app.get('/api/estado', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando y API conectada.' });
});

// INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});