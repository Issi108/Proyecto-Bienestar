// Comprobamos si hay sesión iniciada
const usuarioGuardado = localStorage.getItem('usuario');

if (!usuarioGuardado) {
    // Si no hay datos, lo devolvemos a la página de login
    window.location.href = '/index.html';
}

// Convertimos el texto guardado de vuelta a un objeto JavaScript
const usuario = JSON.parse(usuarioGuardado);

// Cerrar sesión
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('usuario'); // Borramos sus datos
    window.location.href = '/index.html'; // Lo mandamos al login
});

// Generar planning semanal
const btnGenerar = document.getElementById('btn-generar');
const gridPlanning = document.getElementById('grid-planning');

btnGenerar.addEventListener('click', async () => {
    console.log("¡He hecho clic en el botón!"); // Usado como depuración técnica para encontrar el error
    try {
        // Pedimos al motor que genere el planning pasando el ID del usuario
        const response = await fetch('/api/planning/generar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: usuario.id })
        });

        const data = await response.json();

        if (response.ok) {
            // Si el backend dice "Generado con éxito", era la primera vez
            // Si devuelve el array directamente, pintarVideos
            
            if (data.planning) {
                // Si el planning ya existía y nos devuelve los vídeos
                pintarVideos(data.planning);
            } else {
                // Si lo acaba de crear, le pedimos al usuario que recargue para verlo
                gridPlanning.innerHTML = `<p style="color: green; font-weight: bold;">¡Semana generada! Vuelve a pulsar el botón para ver tus vídeos.</p>`;
            }
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor.');
    }
});

// Función auxiliar para dibujar los vídeos en el HTML
function pintarVideos(videos) {
    // Vaciamos el contenedor primero
    gridPlanning.innerHTML = '';

    // Recorremos los 5 vídeos y creamos una "tarjeta" para cada uno
    videos.forEach(video => {
        const tarjeta = document.createElement('div');
        tarjeta.style.background = '#f9f9f9';
        tarjeta.style.padding = '15px';
        tarjeta.style.borderRadius = '8px';
        tarjeta.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        tarjeta.innerHTML = `
            <h3 style="margin-bottom: 10px; color: #D4A373;">${video.titulo}</h3>
            <p><strong>Duración:</strong> ${video.duracion} min</p>
            <a href="${video.url}" target="_blank" style="display: block; margin-top: 10px; color: #4A3B32; text-decoration: underline;">Ver vídeo</a>

            <button onclick="marcarComoCompletado(${video.id_planning}, this)" class="btn-outline" style="margin-top: 10px; width: 100%;">
                ${video.completado ? '✅ Completado' : 'Marcar como completado'}
            </button>
        `;
        
        gridPlanning.appendChild(tarjeta);
    });
}

// Repositorio y Favoritos

const gridRepositorio = document.getElementById('grid-repositorio');
const btnFiltrar = document.getElementById('btn-filtrar');

// Función para cargar los vídeos del backend
async function cargarRepositorio() {
    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();
        
        pintarRepositorio(videos);
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        gridRepositorio.innerHTML = '<p>Error al cargar los vídeos.</p>';
    }
}

// Función para dibujar el catálogo de vídeos
function pintarRepositorio(videos) {
    gridRepositorio.innerHTML = ''; // Limpiamos el contenedor

    // Leemos el filtro actual (si el usuario ha seleccionado alguno)
    const nivelSeleccionado = document.getElementById('filtro-nivel').value;
    const estadoSeleccionado = document.getElementById('filtro-estado').value;

    // Filtramos los vídeos si hace falta
        const videosFiltrados = videos.filter(video => {
        const cumpleNivel = (nivelSeleccionado === "") || (video.nivel_id == nivelSeleccionado);
        const cumpleEstado = (estadoSeleccionado === "") || (video.estado_id == estadoSeleccionado);
        
        return cumpleNivel && cumpleEstado;
    });

    if (videosFiltrados.length === 0) {
        gridRepositorio.innerHTML = '<p>No hay vídeos para este nivel.</p>';
        return;
    }

    // Dibujamos las tarjetas
    videosFiltrados.forEach(video => {
        const tarjeta = document.createElement('div');
        tarjeta.style.background = '#fff';
        tarjeta.style.padding = '15px';
        tarjeta.style.borderRadius = '8px';
        tarjeta.style.border = '1px solid #eee';
        
        tarjeta.innerHTML = `
            <h4 style="color: #4A3B32;">${video.titulo}</h4>
            <p style="font-size: 0.9em; color: #666;">Duración: ${video.duracion} min</p>
            <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <a href="${video.url}" target="_blank" style="color: #D4A373; font-weight: bold;">Ver vídeo</a>
                <button class="btn-favorito btn-outline" data-id="${video.id_video}" style="padding: 5px 10px; font-size: 0.8em;">🧡 Favorito</button>
            </div>
        `;
        gridRepositorio.appendChild(tarjeta);
    });

    // Añadimos el evento a los botones de favorito
    activarBotonesFavoritos();
}

// Lógica para guardar en favoritos
function activarBotonesFavoritos() {
    const botones = document.querySelectorAll('.btn-favorito');
    
    botones.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id_video = e.target.getAttribute('data-id');
            
            try {
                const response = await fetch('/api/favoritos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id_usuario: usuario.id, 
                        id_video: parseInt(id_video) 
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('¡Vídeo guardado en tus favoritos!');
                    e.target.style.background = '#ffdddd'; // Cambiamos el color para que se note
                } else {
                    alert(data.error); // Por ejemplo si el vídeo ya está guardado
                }
            } catch (error) {
                alert('Error al conectar con el servidor.');
            }
        });
    });
}

// Evento para el botón de filtrar
btnFiltrar.addEventListener('click', cargarRepositorio);

// Cargar el catálogo automáticamente al entrar en la página
cargarRepositorio();


// Lógica para ver los favoritos

const gridFavoritos = document.getElementById('grid-favoritos');
const btnCargarFavoritos = document.getElementById('btn-cargar-favoritos');

async function cargarFavoritos() {
    try {
        // Pedimos los favoritos de un usuario en concreto
        const response = await fetch(`/api/favoritos/${usuario.id}`);
        const favoritos = await response.json();

        gridFavoritos.innerHTML = ''; // Limpiamos el contenedor

        if (!favoritos || favoritos.length === 0) {
            gridFavoritos.innerHTML = '<p>No tienes ningún vídeo guardado en favoritos.</p>';
            return;
        }

        // Dibujamos las tarjetas de los favoritos
        favoritos.forEach(video => {
            const tarjeta = document.createElement('div');
            tarjeta.style.background = '#fff';
            tarjeta.style.padding = '15px';
            tarjeta.style.borderRadius = '8px';
            tarjeta.style.border = '1px solid #ffdddd'; // Borde rojizo para distinguirlos
            
            tarjeta.innerHTML = `
                <h4 style="color: #4A3B32;">🧡 ${video.titulo}</h4>
                <p style="font-size: 0.9em; color: #666;">Duración: ${video.duracion} min</p>
                <a href="${video.url}" target="_blank" style="display:block; margin-top: 15px; color: #D4A373; font-weight: bold;">Ver vídeo</a>
            `;
            gridFavoritos.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        gridFavoritos.innerHTML = '<p>Error al cargar tus vídeos favoritos.</p>';
    }
}

// Evento para el botón
btnCargarFavoritos.addEventListener('click', cargarFavoritos);

// Cargar los favoritos automáticamente al entrar al Dashboard
cargarFavoritos();

// Lógica para marcar como completado vídeos
async function marcarComoCompletado(id_planning, boton) {
    try {
        const response = await fetch(`/api/planning/${id_planning}/completar`, {
          method: 'PATCH'
        });
        
        if (response.ok) {
            boton.textContent = '✅ Completado';
            boton.disabled = true;
            boton.style.opacity = '0.6';
        } else {
            // Recogemos el error 404 o 500 que se manda desde el backend
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
}

// Lógica para actualizar el perfil

const formPerfil = document.getElementById('form-perfil');

// Asegurarnos de que el formulario de perfil existe en esta página
if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            nivel_id: document.getElementById('perfil-nivel').value,
            estado_preferente_id: document.getElementById('perfil-estado').value
        };

        try {
            const response = await fetch(`/api/auth/perfil/${usuario.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert('¡Preferencias actualizadas! Se aplicarán en tu próximo planning.');
                // Actualizamos el objeto usuario en la memoria del navegador
                usuario.nivel_id = datos.nivel_id;
                usuario.estado_preferente_id = datos.estado_preferente_id;
                localStorage.setItem('usuario', JSON.stringify(usuario));
            } else {
                alert('Hubo un problema al actualizar tu perfil.');
            }
        } catch (error) {
            alert('Error al actualizar el perfil.');
        }
    });
}