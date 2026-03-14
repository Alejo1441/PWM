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

        const respuesta = await fetch('../partials/Talleres-Previsualizacion.html');
        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");
        const main = await respuesta.text();

        const respuestaJson = await fetch('../json/content.json');
        if (!respuestaJson.ok) throw new Error("Error cargando el JSON");
        const datosGenerales = await respuestaJson.json();

        const talleres = datosGenerales.talleres.slice(0,2);

        const mainContainer = document.getElementById('main-content');

        let mainfinal = '<div class="tu-contenedor-flex">';

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
                .replaceAll('{{imagen}}', taller.image[0]) // Tomamos la 1ra imagen del array
                .replaceAll('{{resenas}}', numeroResenas)
                .replaceAll('★★★★★', estrellasVisuales); // Cambiamos las fijas por las dinámicas

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
        const footer = await respuesta.text();

        footerContainer.innerHTML = footer;

    } catch (error) {
        console.error("Error al pintar el footer:", error);
    }
}