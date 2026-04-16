document.getElementById('form-admin').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoVideo = {
        titulo: document.getElementById('admin-titulo').value,
        url: document.getElementById('admin-url').value,
        duracion: document.getElementById('admin-duracion').value,
        nivel_id: document.getElementById('admin-nivel').value,
        estado_id: document.getElementById('admin-estado').value
    };

    try {
        const response = await fetch('/api/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoVideo)
        });

        if (response.ok) {
            alert('¡Vídeo añadido correctamente!');
            document.getElementById('form-admin').reset(); // Vaciamos el formulario
        } else {
            alert('Error al añadir el vídeo.');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión.');
    }
});