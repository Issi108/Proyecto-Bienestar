const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database'); // Importamos la conexión a la base de datos

// ==========================================
// CASO DE USO 1: REGISTRO DE USUARIO
// Ruta: POST /api/auth/registro
// ==========================================
router.post('/registro', async (req, res) => {
    // 1. Recibimos los datos del formulario (frontend)
    const { nombre, email, password, nivel_id, estado_preferente_id } = req.body;

    // 2. Validamos campos vacíos según tu Caso de Uso
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Debe completar todos los campos obligatorios.' });
    }

    try {
        // 3. Encriptar la contraseña (Requisito No Funcional 1)
        // El '10' es el nivel de seguridad del encriptado (salt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Guardar en la base de datos
        const sql = `INSERT INTO usuarios (nombre, email, password, nivel_id, estado_preferente_id) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [nombre, email, hashedPassword, nivel_id, estado_preferente_id], function(err) {
            if (err) {
                // Si SQLite da un error porque el email ya existe (la columna es UNIQUE)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
                }
                // Si es cualquier otro error de la base de datos
                return res.status(500).json({ error: 'Ha ocurrido un error inesperado. Inténtelo más tarde.' });
            }
            
            // 5. Éxito: Devolvemos un mensaje y el ID del nuevo usuario
            res.status(201).json({ 
                mensaje: 'Usuario registrado con éxito', 
                id_usuario: this.lastID 
            });
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el registro.' });
    }
});

// ==========================================
// CASO DE USO 2: LOGIN DE USUARIO
// Ruta: POST /api/auth/login
// ==========================================
router.post('/login', (req, res) => {
    // 1. Recibimos los datos
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Debe ingresar email y contraseña.' });
    }

    // 2. Buscamos al usuario en la base de datos por su email
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    
    db.get(sql, [email], async (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Ha ocurrido un error inesperado. Inténtelo más tarde.' });
        }
        
        // 3. Si no existe ningún usuario con ese email
        if (!usuario) {
            return res.status(400).json({ error: 'Email no existe' });
        }

        // 4. Si el email existe, comparamos la contraseña introducida con la encriptada
        const isMatch = await bcrypt.compare(password, usuario.password);
        
        // 5. Si no coinciden
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // 6. Éxito: Devolvemos los datos del usuario (sin enviar la contraseña)
        // Tu frontend podrá usar estos datos para saber quién está conectado y cuál es su nivel
        res.status(200).json({ 
            mensaje: 'Login exitoso', 
            usuario: { 
                id: usuario.id_usuario, 
                nombre: usuario.nombre, 
                nivel_id: usuario.nivel_id, 
                estado_id: usuario.estado_preferente_id 
            } 
        });
    });
});

// Exportamos las rutas para poder usarlas en server.js
module.exports = router;