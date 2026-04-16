const express = require('express');
const router = express.Router();
const db = require('../db/database');


// Función para calcular semana actual

function getSemanaActual() {
    const fechaActual = new Date();
    const inicioAño = new Date(fechaActual.getFullYear(), 0, 1);
    const dias = Math.floor((fechaActual - inicioAño) / (24 * 60 * 60 * 1000));
    const numeroSemana = Math.ceil((dias + inicioAño.getDay() + 1) / 7);
    return { semana: numeroSemana, anio: fechaActual.getFullYear() };
}


// CASO: Generar Planning Semanal
// Ruta: POST /api/planning/generar

router.post('/generar', (req, res) => {
    // Recibimos el ID del usuario
    const { id_usuario } = req.body;
    const { semana, anio } = getSemanaActual();

    if (!id_usuario) {
        return res.status(400).json({ error: 'Falta el id de usuario.' });
    }

    // Verificamos si ya existe una semana generada para este usuario
    const sqlCheck = `SELECT * FROM semanas_usuario WHERE id_usuario = ? AND semana = ? AND anio = ?`;
    
    db.get(sqlCheck, [id_usuario, semana, anio], (err, semanaExistente) => {
        if (err) return res.status(500).json({ error: 'Error al comprobar la semana.' });

        // Si la semana ya existe, mostramos directamente el planning guardado
        if (semanaExistente) {
            const sqlPlanning = `
                SELECT p.id_planning, p.fecha, p.completado, v.titulo, v.duracion, v.url 
                FROM planning_usuario p 
                JOIN videos v ON p.id_video = v.id_video 
                WHERE p.id_semana = ?`;
                
            db.all(sqlPlanning, [semanaExistente.id_semana], (err, videosPlanning) => {
                if (err) return res.status(500).json({ error: 'Error al obtener el planning.' });
                return res.status(200).json({ 
                    mensaje: 'Planning ya generado anteriormente', 
                    semana: semanaExistente, 
                    planning: videosPlanning 
                });
            });
        } 
        // Si no existe, procedemos a generarlo
        else {
            // Recibimos las preferencias actuales del usuario
            const sqlUser = `SELECT nivel_id, estado_preferente_id FROM usuarios WHERE id_usuario = ?`;
            
            db.get(sqlUser, [id_usuario], (err, usuario) => {
                if (err || !usuario) return res.status(500).json({ error: 'Error al buscar preferencias del usuario.' });

                const nivel = usuario.nivel_id;
                const estado = usuario.estado_preferente_id;

                // Seleccionamos 5 vídeos (activos y de forma aleatoria) que cumplan los criterios 
                const sqlVideos = `SELECT id_video FROM videos WHERE nivel_id = ? AND estado_id = ? AND activo = 1 ORDER BY RANDOM() LIMIT 5`;
                
                db.all(sqlVideos, [nivel, estado], (err, videos) => {
                    if (err) return res.status(500).json({ error: 'Error al buscar vídeos.' });

                    // Controlamos el error de que no haya suficientes vídeos
                    if (videos.length < 5) {
                        return res.status(400).json({ error: 'No hay suficientes vídeos disponibles para esta combinación.' });
                    }

                    // Insertamos la nueva semana en semanas_usuario
                    const sqlInsertSemana = `INSERT INTO semanas_usuario (id_usuario, semana, anio, nivel_usado_id, estado_usado_id) VALUES (?, ?, ?, ?, ?)`;
                    
                    db.run(sqlInsertSemana, [id_usuario, semana, anio, nivel, estado], function(err) {
                        if (err) return res.status(500).json({ error: 'No se pudo generar el planning.' });

                        const id_semana_nueva = this.lastID;
                        
                        // Insertamos los 5 vídeos en la tabla planning_usuario
                        const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
                        
                        // Creamos una cadena de inserción múltiple para los 5 vídeos: (?, ?, ?), (?, ?, ?)...
                        const placeholders = videos.map(() => '(?, ?, ?)').join(',');
                        const valores = [];
                        videos.forEach(v => {
                            valores.push(id_semana_nueva, v.id_video, fechaActual);
                        });

                        const sqlInsertPlanning = `INSERT INTO planning_usuario (id_semana, id_video, fecha) VALUES ${placeholders}`;
                        
                        db.run(sqlInsertPlanning, valores, function(err) {
                            if (err) return res.status(500).json({ error: 'Error al guardar los vídeos del planning.' });

                            return res.status(201).json({ 
                                mensaje: 'Planning semanal generado con éxito', 
                                id_semana: id_semana_nueva 
                            });
                        });
                    });
                });
            });
        }
    });
});

// CASO: Marcar vídeo como completado 
// Ruta: PATCH /api/planning/:id_planning/completar

router.patch('/:id_planning/completar', (req, res) => {
    // Obtenemos el ID específico del registro en la tabla planning_usuario
    const id_planning = req.params.id_planning;

    // El sistema se actualiza (completado = 1) 
    const sql = `UPDATE planning_usuario SET completado = 1 WHERE id_planning = ?`;

    db.run(sql, [id_planning], function(err) {
        if (err) return res.status(500).json({ error: 'Error de actualización en base de datos.' }); 

        // Si no se ha modificado ninguna fila, es porque ese ID no existe para el usuario 
        if (this.changes === 0) {
            return res.status(404).json({ error: 'El vídeo no pertenece a su planning.' }); 
        }

        res.status(200).json({ mensaje: 'Vídeo marcado como completado con éxito.' });
    });
});

module.exports = router;