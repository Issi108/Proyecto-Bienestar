const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// RUTAS PÚBLICAS (Repositorio)
// ==========================================

// CASO DE USO 5: Consultar repositorio (con filtros)
// Ruta: GET /api/videos
router.get('/', (req, res) => {
    // Recibimos los filtros opcionales desde la URL (ej: /api/videos?nivel_id=1&estado_id=2)
    const { nivel_id, estado_id } = req.query;
    
    // Por defecto, buscamos solo los vídeos activos
    let sql = `SELECT * FROM videos WHERE activo = 1`;
    let params = [];

    // Si el usuario filtra por nivel, lo añadimos a la consulta
    if (nivel_id) {
        sql += ` AND nivel_id = ?`;
        params.push(nivel_id);
    }
    
    // Si el usuario filtra por estado, lo añadimos
    if (estado_id) {
        sql += ` AND estado_id = ?`;
        params.push(estado_id);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Fallo de conexión con el servidor.' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se han encontrado resultados.' });
        }
        res.status(200).json(rows);
    });
});


// ==========================================
// RUTAS DE ADMINISTRADOR
// ==========================================

// CASO DE USO 8: Alta de vídeo
// Ruta: POST /api/videos
router.post('/', (req, res) => {
    const { titulo, descripcion, url, duracion, nivel_id, estado_id } = req.body;

    if (!url || url.trim() === '') {
        return res.status(400).json({ error: 'La URL no puede estar vacía.' });
    }

    const sql = `INSERT INTO videos (titulo, descripcion, url, duracion, nivel_id, estado_id) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [titulo, descripcion, url, duracion, nivel_id, estado_id], function(err) {
        if (err) {
            if (err.message.includes('FOREIGN KEY')) {
                return res.status(400).json({ error: 'Intenta asignar un nivel o estado inexistente.' });
            }
            return res.status(500).json({ error: 'Error al crear el vídeo.' });
        }
        res.status(201).json({ mensaje: 'Vídeo creado con éxito', id_video: this.lastID });
    });
});

// CASO DE USO 8: Modificación de vídeo
// Ruta: PUT /api/videos/:id
router.put('/:id', (req, res) => {
    const id_video = req.params.id;
    const { titulo, descripcion, url, duracion, nivel_id, estado_id } = req.body;

    const sql = `UPDATE videos SET titulo = ?, descripcion = ?, url = ?, duracion = ?, nivel_id = ?, estado_id = ? WHERE id_video = ?`;
    
    db.run(sql, [titulo, descripcion, url, duracion, nivel_id, estado_id, id_video], function(err) {
        if (err) return res.status(500).json({ error: 'Error al modificar el vídeo.' });
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Vídeo no encontrado.' });
        }
        res.status(200).json({ mensaje: 'Vídeo actualizado correctamente.' });
    });
});

// CASO DE USO 8: Activar/Desactivar vídeo (baja)
// Ruta: PATCH /api/videos/:id/estado
router.patch('/:id/estado', (req, res) => {
    const id_video = req.params.id;
    const { activo } = req.body; // Esperamos recibir un 1 (activo) o un 0 (desactivado)

    const sql = `UPDATE videos SET activo = ? WHERE id_video = ?`;
    
    db.run(sql, [activo, id_video], function(err) {
        if (err) return res.status(500).json({ error: 'Error al cambiar el estado del vídeo.' });
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Vídeo no encontrado.' });
        }
        res.status(200).json({ mensaje: 'Estado del vídeo actualizado.' });
    });
});

module.exports = router;