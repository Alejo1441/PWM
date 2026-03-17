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

        const imagen_perfil = headerContainer.querySelector('#Taller-image');
        if(imagen_perfil){
            imagen_perfil.src = "../Fotos/Nuestro logo.png";
        }


    } catch (error) {
        console.error("Error al pintar el header:", error);
    }
}

async function renderizarMain(datos) {

    try {
        const parametrosURL = new URLSearchParams(window.location.search);
        const idTaller = parametrosURL.get('id');
        const tipo = parametrosURL.get('tipo');

        if (idTaller == 0) {
            if (tipo == 'politicas') {
                const politicas = document.querySelector('#main-content');

                if (politicas) {
                    politicas.innerHTML = '';
                    datos.configuracion.politicas.forEach(politica => {
                        politicas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary>${politica.name_politica}</summary>
    
                                                        <div class="content">
                                                            <p>${politica.politica_texto}</p>
                                                        </div>
                                                    </details>
                                                </article>`;
                    });
                }
            }

            if (tipo == 'preguntas') {
                const preguntas = document.querySelector('#main-content');

                if (preguntas) {
                    preguntas.innerHTML = '';
                    datos.configuracion.preguntas.forEach(pregunta => {
                        preguntas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary>${pregunta.name_pregunta}</summary>
    
                                                        <div class="content">
                                                            <p>${pregunta.pregunta_texto}</p>
                                                        </div>
                                                    </details>
                                                </article>`;
                    });
                }
            }

        }else{

            if (tipo == 'politicas') {
                const politicas = document.querySelector('#main-content');

                if (politicas) {
                    politicas.innerHTML = '';
                    datos.talleres.forEach(taller => {
                        if (taller.id == idTaller){
                            taller.politicas.forEach(politica => {
                                politicas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary>${politica.name_politica}</summary>
    
                                                        <div class="content">
                                                            <p>${politica.politica_texto}</p>
                                                        </div>
                                                    </details>
                                                </article>`;
                            });
                        }
                    });
                }
            }

            if (tipo == 'preguntas') {
                const preguntas = document.querySelector('#main-content');

                if (preguntas) {
                    preguntas.innerHTML = '';
                    datos.talleres.forEach(taller => {
                        if (taller.id == idTaller){
                            taller.preguntas.forEach(pregunta => {
                                preguntas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary>${pregunta.name_pregunta}</summary>
    
                                                        <div class="content">
                                                            <p>${pregunta.pregunta_texto}</p>
                                                        </div>
                                                    </details>
                                                </article>`;
                            });
                        }
                    });
                }
            }
        }



    }catch (error) {
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