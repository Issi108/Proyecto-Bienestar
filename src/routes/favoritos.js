const express = require('express');
const router = express.Router();
const db = require('../db/database');


// CASO: Guardar en favoritos 
// Ruta: POST /api/favoritos

router.post('/', (req, res) => {
    const { id_usuario, id_video } = req.body;

    // Comprobamos que el usuario esté autenticado (enviando su ID) 
    if (!id_usuario || !id_video) {
        return res.status(401).json({ error: 'Usuario no autenticado o faltan datos.' });
    }

    // Comprobar si el vídeo ya está guardado para ese usuario 
    const sqlCheck = `SELECT * FROM favoritos WHERE id_usuario = ? AND id_video = ?`;
    
    db.get(sqlCheck, [id_usuario, id_video], (err, favorito) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos.' }); 

        if (favorito) {
            return res.status(400).json({ error: 'El vídeo ya está guardado.' }); // 
        }

        // Si no está guardado, el sistema inserta el registro 
        const sqlInsert = `INSERT INTO favoritos (id_usuario, id_video) VALUES (?, ?)`;
        
        db.run(sqlInsert, [id_usuario, id_video], function(err) {
            if (err) return res.status(500).json({ error: 'Error en la base de datos.' });
            
            // Si todo ok, se muestra confirmación 
            res.status(201).json({ 
                mensaje: 'Vídeo guardado en favoritos correctamente.', 
                id_favorito: this.lastID 
            });
        });
    });
});
// CASO: Obtener la lista de favoritos de un usuario
// Ruta: GET /api/favoritos/:id_usuario
router.get('/:id_usuario', (req, res) => {
    // Conseguimos el ID del usuario de la URL
    const { id_usuario } = req.params;

    // Preparamos la consulta SQL: Unimos (JOIN) la tabla de vídeos con la de favoritos 
    // Sacamos los vídeos que pertenecen a este usuario
    const sql = `
        SELECT v.id_video, v.titulo, v.duracion, v.url 
        FROM videos v
        JOIN favoritos f ON v.id_video = f.id_video
        WHERE f.id_usuario = ?
    `;

    // Ejecutamos la consulta
    db.all(sql, [id_usuario], (err, rows) => {
        if (err) {
            console.error("Error al obtener favoritos:", err);
            return res.status(500).json({ error: 'Error al obtener la lista de favoritos.' });
        }
        
    // Devolvemos los vídeos encontrados al frontend
        res.json(rows);
    });
});


module.exports = router;