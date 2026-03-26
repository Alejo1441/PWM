document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

async function cargarDatos() {
    try {
        const respuesta = await fetch('../json/content.json');

        if (!respuesta.ok) throw new Error("Error al cargar el JSON");

        const datos = await respuesta.json();

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

async function renderizarHeader(config) {
    const headerContainer = document.getElementById('site-header');

    try {
        const respuesta = await fetch('../partials/Header.html'); // Ajusta tu ruta

        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");

        const header = await respuesta.text();

        headerContainer.innerHTML = header;

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

            const contenedorInfo = document.querySelector('.TallerInfo');
            if (contenedorInfo && tallerSeleccionado.image.length > 0) {
                const rutaFoto = `../${tallerSeleccionado.image[0]}`;
                contenedorInfo.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
            }

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
                    const boton = document.createElement('a');
                    boton.href = `../pages/calendar.html?id=${tallerSeleccionado.id}`;
                    boton.className = 'botonEspecialidad';
                    boton.textContent = especialidad.service;

                    boton.addEventListener('click', () => {
                        const selectedService = {
                            workshopId: tallerSeleccionado.id,
                            workshopName: tallerSeleccionado.name,
                            serviceName: especialidad.service,
                            price: especialidad.price
                        };

                        localStorage.setItem('selectedService', JSON.stringify(selectedService));
                    });

                    cajaBotones.appendChild(boton);
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
        }

    } catch (error) {
        console.error("Error al pintar el main:", error);
    }

}

async function renderizarFooter(datos) {
    const footerContainer = document.getElementById('site-footer');

    try {

        const respuesta = await fetch('../partials/footer.html'); // Ajusta tu ruta
        if (!respuesta.ok) throw new Error("Error cargando el HTML del footer");
        let footer = await respuesta.text();

        const parametrosURL = new URLSearchParams(window.location.search);
        let idActual = parametrosURL.get('id') || 0;
        footer = footer.replaceAll('{{id}}', idActual);

        footerContainer.innerHTML = footer;

    } catch (error) {
        console.error("Error al pintar el footer:", error);
    }
}