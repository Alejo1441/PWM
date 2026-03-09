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
            await renderizarHeader(datos.configuracion);
        }

        if (document.querySelector('.TallerInfo')) {
            await renderizarMain();
        }

        if (document.getElementById('site-footer')) {
            renderizarFooter(datos.footer);
        }

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


    } catch (error) {
        console.error("Error al pintar el header:", error);
    }
}

async function renderizarMain() {

    try {

        const parametrosURL = new URLSearchParams(window.location.search);
        const idTaller = parametrosURL.get('id');

        if (!idTaller) throw new Error("Falta el ID del taller en la URL");

        const respuestaJson = await fetch('../json/content.json');
        if (!respuestaJson.ok) throw new Error("Error al cargar el JSON");

        const datosGenerales = await respuestaJson.json();

        const tallerSeleccionado = datosGenerales.talleres.find(t => t.id == idTaller);

        if (tallerSeleccionado) {

            const parrafoInfo = document.querySelector('.InfoTaller');
            if (parrafoInfo) {
                parrafoInfo.textContent = tallerSeleccionado.description;
            }

            const cajaImagen = document.querySelector('.CajaImagen');
            if (cajaImagen) {
                cajaImagen.innerHTML = '';
                tallerSeleccionado.image.forEach(imgUrl => {
                    cajaImagen.innerHTML += `<img src="../${imgUrl}" alt="Foto de ${tallerSeleccionado.name}" class="foto-taller">`;
                });
            }

            const cajaBotones = document.querySelector('.cajabotones');
            if (cajaBotones) {
                cajaBotones.innerHTML = '';

                tallerSeleccionado.speciality.forEach(especialidad => {
                    cajaBotones.innerHTML += `<a href="../pages/calendar.html" class="botonEspecialidad">${especialidad.service} - ${especialidad.price}€</a>`;
                });
            }

            const numeroResenas = tallerSeleccionado.reviews.length;
            let promedio = 0;

            if (numeroResenas > 0) {
                const suma = tallerSeleccionado.reviews.reduce((acc, review) => acc + review.stars, 0);
                promedio = Math.round(suma / numeroResenas);
            }

            const estrellasVisuales = '★'.repeat(promedio) + '☆'.repeat(5 - promedio);

            const spanEstrellas = document.querySelector('.estrellas');
            const enlaceResenas = document.querySelector('.texto-resenas');

            if (spanEstrellas) spanEstrellas.textContent = estrellasVisuales;

            if (enlaceResenas) {
                enlaceResenas.textContent = `${numeroResenas} Reseñas`;
                enlaceResenas.href = `reviews.html?id=${tallerSeleccionado.id}`;
            }
            document.title = `${tallerSeleccionado.name} - Mi Taller Web`;

        } else {
            console.error("No existe ningún taller con el ID:", idTaller);
            document.querySelector('.TallerInfo').innerHTML = "<h2>Taller no encontrado</h2>";
        }

    } catch (error) {
        console.error("Error al pintar el main:", error);
    }

}

async function renderizarFooter(datos) {
    const footerContainer = document.getElementById('site-footer');

    try {

        const respuesta = await fetch('../partials/footer.html'); // Ajusta tu ruta
        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");
        const footer = await respuesta.text();

        footerContainer.innerHTML = footer;

    } catch (error) {
        console.error("Error al pintar el header:", error);
    }
}