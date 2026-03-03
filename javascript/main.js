// Esperamos a que el HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

// Lógica de lectura usando async/await
async function cargarDatos() {
    try {
        // 1. Esperamos (await) a que se descargue el JSON
        const respuesta = await fetch('../json/content.json');

        if (!respuesta.ok) throw new Error("Error al cargar el JSON");

        // 2. Esperamos (await) a que se convierta en objeto JS
        const datos = await respuesta.json();

        // 3. Renderizamos las partes de la página
        if (document.getElementById('site-header')) {
            await renderizarHeader(datos.configuracion); // También le ponemos await por si acaso
        }

        /*
        if (document.getElementById('main-content')) {
            renderizarMain(datos.talleres);
        }

        if (document.getElementById('site-footer')) {
            renderizarFooter(datos.footer);
        }
        */
    } catch (error) {
        console.error("Fallo en el Corazón de Datos:", error);
    }
}

// Le añadimos "async" a la función
async function renderizarHeader(config) {
    const headerContainer = document.getElementById('site-header');

    try {
        // 1. Hacemos el fetch al archivo HTML y esperamos
        const respuesta = await fetch('../partials/Header.html'); // Ajusta tu ruta

        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");

        // 2. Esperamos a que nos devuelva el texto del HTML
        const header = await respuesta.text();

        // 3. Lo inyectamos en la pantalla
        headerContainer.innerHTML = header;

        // 4. Inyectamos los datos dinámicos (Ej: el texto alternativo del logo)
        const logo = headerContainer.querySelector('.logo_circular');
        if (logo) {
            logo.alt = `Logo de ${config.nombreSitio}`;
        }

        const imagenPerfil = document.getElementById('Taller-image');
        if (imagenPerfil) {
            imagenPerfil.src = "../Fotos/mapa.png";
        }

    } catch (error) {
        console.error("Error al pintar el header:", error);
    }
}