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

        if (document.querySelector('.reviews')) {
            await renderizarMain(datos);
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

async function renderizarMain(datos) {

    try {

        const parametrosURL = new URLSearchParams(window.location.search);
        const idTaller = parametrosURL.get('id');

        if (!idTaller) throw new Error("Falta el ID del taller en la URL");


        const tallerSeleccionado = datos.talleres.find(t => t.id == idTaller);

        if (tallerSeleccionado) {

            const contenedorReview = document.querySelector('.reviews');
            if (contenedorReview && tallerSeleccionado.image.length > 0) {
                const rutaFoto = `../${tallerSeleccionado.image[0]}`;
                contenedorReview.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
            }

            const nombre_taller = document.querySelector('.nombre-taller');
            nombre_taller.textContent = `Reviews del Taller '${tallerSeleccionado.name}'`;

            const resena = document.querySelector(".resena")

            if (resena) {
                resena.innerHTML = '';
                tallerSeleccionado.reviews.forEach(review => {
                    const valoracion = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars)
                    resena.innerHTML += `<div class="item-resena">
                                            <img src="../Fotos/fotoperfil.webp" alt="perfil" class="logo_circular">
                                                <span class="estrellas">${valoracion}</span>
                                                <p class="texto-resenas"> ${review.comment}</p>
                                            </div>
                                         </div>`;
                });
            }

        } else {
            console.error("No existe ningún taller con el ID:", idTaller);
        }

    }catch(error) {
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