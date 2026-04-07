const express = require('express');
const cors = require('cors');

// Importamos el archivo de la base de datos. 
// Al hacer esto, el código de database.js se ejecuta y crea el archivo .sqlite
const db = require('./src/db/database'); 
const authRoutes = require('./src/routes/auth'); // Lógica de inicio de sesión, registro, contraseñas...
const videosRoutes = require('./src/routes/videos'); // CRUD de vídeos
const planningRoutes = require('./src/routes/planning'); // Lógica matemática y de base de datos para generar planning
const favoritosRoutes = require('./src/routes/favoritos'); // Lógica para guardar un vídeo en favoritos

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES (Configuraciones base)
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a nuestro servidor entender los datos JSON que enviemos desde formularios
app.use('/api/auth', authRoutes); // Pasa cualquier URL que empiece por '/api/auth' al archivo de registro/login
app.use('/api/videos', videosRoutes); // Monta todo el CRUD (Buscar, Crear, Editar, Borrar) de vídeos en esta URL base
app.use('/api/planning', planningRoutes); // Conecta la lógica de generación del calendario semanal bajo la ruta '/api/planning'
app.use('/api/favoritos', favoritosRoutes); // Delega las peticiones que lleguen a '/api/favoritos' al archivo que gestiona la lógica de favoritos
app.use(express.static('public')); // Expone la carpeta 'public' para que el navegador pueda descargar imágenes, CSS o HTML directamente

// RUTA DE PRUEBA
// Si entramos a http://localhost:3000/api/estado, veremos este mensaje
app.get('/api/estado', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando y API conectada.' });
});

// INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});