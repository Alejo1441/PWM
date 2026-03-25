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
            await renderizarHeader(datos);
        }

        if (document.getElementById('main-content')) {
           await renderizarMain();
        }

        if (document.getElementById('site-footer')) {
            renderizarFooter(datos.footer);
        }

    } catch (error) {
        console.error("Fallo en el Corazón de Datos:", error);
    }
}

async function renderizarHeader(datos) {
    const headerContainer = document.getElementById('site-header');

    try {
        const respuesta = await fetch('../partials/Header.html'); // Ajusta tu ruta

        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");

        const header = await respuesta.text();

        headerContainer.innerHTML = header;

        const formularioBuscador = document.getElementById('search-form');
        const inputBuscador = document.getElementById('search-input');

        if (formularioBuscador && inputBuscador) {
            formularioBuscador.addEventListener('submit', async function(evento) {
                evento.preventDefault();
                const palabra = inputBuscador.value.trim().toLowerCase();

                if (palabra !== "") {
                    try {

                        const tallerEncontrado = datos.talleres.find(taller =>
                            taller.name.toLowerCase().includes(palabra)
                        );

                        if (tallerEncontrado) {
                            window.location.href = `../pages/Taller-Informacion.html?id=${tallerEncontrado.id}`;
                        } else {
                            alert(`Lo sentimos, no hemos encontrado ningún taller llamado "${palabra}".`);
                        }

                    } catch (error) {
                        console.error("Fallo al buscar el taller:", error);
                    }
                }
            });
        }

        const logo = headerContainer.querySelector('.logo_circular');
        if (logo) {
            logo.alt = `Logo de ${datos.configuracion.nombreSitio}`;
        }

        const imagen_perfil = headerContainer.querySelector('#Taller-image');
        if(imagen_perfil){
            imagen_perfil.src = "../Fotos/Nuestro logo.png";
        }


    } catch (error) {
        console.error("Error al pintar el header:", error);
    }
}

async function renderizarMain() {

    try {

        const respuesta = await fetch('../partials/Talleres-Previsualizacion.html');
        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");
        const main = await respuesta.text();

        const respuestaJson = await fetch('../json/content.json');
        if (!respuestaJson.ok) throw new Error("Error cargando el JSON");
        const datosGenerales = await respuestaJson.json();

        const talleres = datosGenerales.talleres.slice(0,2);

        const mainContainer = document.getElementById('main-content');

        const rutaFoto = `../Fotos/Fondo pagina.png`;
        mainContainer.style.setProperty('--bg-taller', `url('${rutaFoto}')`);

        let mainfinal = '<div class="Home">';

        talleres.forEach(taller => {
            const numeroResenas = taller.reviews.length;
            let promedio = 0;

            if (numeroResenas > 0) {
                const sumaEstrellas = taller.reviews.reduce((suma, review) => suma + review.stars, 0);
                promedio = Math.round(sumaEstrellas / numeroResenas);
            }

            const estrellasVisuales = '★'.repeat(promedio) + '☆'.repeat(5 - promedio);

            let tarjetaTaller = main
                .replaceAll('{{id}}', taller.id)
                .replaceAll('{{nombre}}', taller.name)
                .replaceAll('{{imagen}}', taller.image[0])
                .replaceAll('{{resenas}}', numeroResenas)
                .replaceAll('★★★★★', estrellasVisuales);

            mainfinal += tarjetaTaller;

        });

        mainfinal += '</div>';
        mainContainer.innerHTML = mainfinal;

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