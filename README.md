# 🌿 Plataforma de Bienestar Integral y Personalizado

## 📖 Descripción del Proyecto
Esta aplicación web nace con el objetivo de mejorar la salud física y mental de los usuarios mediante la práctica de disciplinas como yoga, barre y meditación. A diferencia de los repositorios de vídeo generalistas, esta plataforma combate "la paradoja de la elección" ofreciendo una experiencia centrada en el usuario, adaptando los contenidos a su nivel físico y su estado emocional actual.

Este proyecto ha sido desarrollado como Proyecto de Fin de Grado (PFG) para consolidar conocimientos en el stack Full Stack basado en JavaScript.

## ✨ Funcionalidades Principales
* **🧠 Filtrado Emocional y Físico:** Los usuarios pueden buscar rutinas basándose en su estado de ánimo (ej. Calma, Equilibrio, Energía) y su nivel de práctica (Principiante, Avanzado).
* **🗓️ Planning Semanal Inteligente:** El motor de la aplicación genera automáticamente una rutina de 5 días adaptada a las preferencias del usuario, almacenando el histórico semanal.
* **❤️ Gestión de Favoritos y Progreso:** Posibilidad de guardar vídeos favoritos y marcar como "completadas" las rutinas del planning para llevar un seguimiento individual.
* **🔒 Seguridad y Autenticación:** Registro e inicio de sesión seguro con contraseñas encriptadas mediante Bcrypt y validación de datos en el servidor.

## 🛠️ Stack Tecnológico
El sistema sigue una arquitectura cliente-servidor estructurada en 3 capas, comunicadas a través de una API RESTful:

**Frontend (Capa de Presentación):**
* HTML5 Semántico
* CSS3 (Flexbox/Grid, Variables CSS, Diseño Responsive)
* JavaScript Nativo (Fetch API para interactividad asíncrona SPA)

**Backend (Capa de Lógica de Negocio):**
* Node.js
* Express.js (Enrutamiento modular y Middlewares)

**Base de Datos (Capa de Datos):**
* SQLite (Base de datos relacional)

**Testing y Control de Calidad:**
* Jest & Supertest (Pruebas unitarias y de integración)
* Thunder Client (Pruebas manuales de API)

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Issi108/Proyecto-Bienestar.git](https://github.com/Issi108/Proyecto-Bienestar.git)
   ```

2. **Navegar al directorio del proyecto:**
   ```bash
   cd Proyecto-Bienestar
   ```

3. **Instalar las dependencias de Node.js:**
   ```bash
   npm install
   ```

4. **Levantar el servidor:**
   ```bash
   node server.js
   ```

5. **Abrir la aplicación:**
   Abre tu navegador web y visita `http://localhost:3000` (o el puerto que hayas configurado).

## 🧪 Ejecución de Pruebas (Testing)
El proyecto cuenta con pruebas automatizadas para validar la lógica del backend y la seguridad de la base de datos. Para ejecutarlas, utiliza el siguiente comando:

```bash
npm run test
```

## 🔮 Líneas de Futuro
* Ampliación del algoritmo de planificación para soportar filtros múltiples.
* Integración con una API de correo electrónico (ej. Nodemailer) para envíos semanales.
* Creación de un módulo social o "Comunidad".
* Migración a aplicación móvil nativa o PWA.

## 👩‍💻 Autoría
Desarrollado con 🧡 por **Isabel Muñoz Drajska** como Proyecto Final de Desarrollo de Aplicaciones Web.
