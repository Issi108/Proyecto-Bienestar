const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Definimos la ruta donde se guardará el archivo .sqlite
const dbPath = path.resolve(__dirname, 'bienestar.sqlite');

// 2. Conectamos (si no existe, SQLite crea el archivo automáticamente)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// 3. Activamos las claves foráneas y creamos las tablas
db.serialize(() => {
    // Es VITAL activar esto en SQLite para mantener la integridad referencial
    db.run('PRAGMA foreign_keys = ON');

    // Tabla: niveles
    db.run(`CREATE TABLE IF NOT EXISTS niveles (
        id_nivel INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
    )`);

    // Tabla: estados_emocionales
    db.run(`CREATE TABLE IF NOT EXISTS estados_emocionales (
        id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT
    )`);

    // Tabla: usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nivel_id INTEGER,
        estado_preferente_id INTEGER,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nivel_id) REFERENCES niveles(id_nivel),
        FOREIGN KEY (estado_preferente_id) REFERENCES estados_emocionales(id_estado)
    )`);

    // Tabla: videos
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id_video INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        url TEXT NOT NULL,
        duracion INTEGER,
        nivel_id INTEGER,
        estado_id INTEGER,
        activo INTEGER DEFAULT 1,
        FOREIGN KEY (nivel_id) REFERENCES niveles(id_nivel),
        FOREIGN KEY (estado_id) REFERENCES estados_emocionales(id_estado)
    )`);

    // Tabla: favoritos
    db.run(`CREATE TABLE IF NOT EXISTS favoritos (
        id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        id_video INTEGER,
        fecha_guardado DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_video) REFERENCES videos(id_video) ON DELETE CASCADE
    )`);

    // Tabla: semanas_usuario
    db.run(`CREATE TABLE IF NOT EXISTS semanas_usuario (
        id_semana INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        semana INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        nivel_usado_id INTEGER,
        estado_usado_id INTEGER,
        fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (nivel_usado_id) REFERENCES niveles(id_nivel),
        FOREIGN KEY (estado_usado_id) REFERENCES estados_emocionales(id_estado),
        UNIQUE (id_usuario, semana, anio)
    )`);

    // Tabla: planning_usuario
    db.run(`CREATE TABLE IF NOT EXISTS planning_usuario (
        id_planning INTEGER PRIMARY KEY AUTOINCREMENT,
        id_semana INTEGER,
        id_video INTEGER,
        fecha DATE,
        completado INTEGER DEFAULT 0,
        FOREIGN KEY (id_semana) REFERENCES semanas_usuario(id_semana) ON DELETE CASCADE,
        FOREIGN KEY (id_video) REFERENCES videos(id_video) ON DELETE CASCADE
    )`);
});

// Exportamos la conexión para poder usarla en otros archivos
module.exports = db;