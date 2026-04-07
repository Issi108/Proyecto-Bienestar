const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// CASO DE USO 6: Guardar en favoritos 
// Ruta: POST /api/favoritos
// ==========================================
router.post('/', (req, res) => {
    const { id_usuario, id_video } = req.body;

    // Controlamos que el usuario esté autenticado (enviando su ID) 
    if (!id_usuario || !id_video) {
        return res.status(401).json({ error: 'Usuario no autenticado o faltan datos.' });
    }

    // 1. Comprobar si el vídeo ya está guardado para ese usuario 
    const sqlCheck = `SELECT * FROM favoritos WHERE id_usuario = ? AND id_video = ?`;
    
    db.get(sqlCheck, [id_usuario, id_video], (err, favorito) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos.' }); 

        if (favorito) {
            return res.status(400).json({ error: 'El vídeo ya está guardado.' }); // 
        }

        // 2. Si no está guardado, el sistema inserta el registro 
        const sqlInsert = `INSERT INTO favoritos (id_usuario, id_video) VALUES (?, ?)`;
        
        db.run(sqlInsert, [id_usuario, id_video], function(err) {
            if (err) return res.status(500).json({ error: 'Error en la base de datos.' });
            
            // Se muestra confirmación 
            res.status(201).json({ 
                mensaje: 'Vídeo guardado en favoritos correctamente.', 
                id_favorito: this.lastID 
            });
        });
    });
});

module.exports = router;