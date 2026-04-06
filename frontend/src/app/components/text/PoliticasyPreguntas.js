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
            await renderizarMain(datos);
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
        const respuesta = await fetch('../partials/Header.html');

        if (!respuesta.ok) throw new Error("Error cargando el HTML del header");

        const header = await respuesta.text();

        headerContainer.innerHTML = header;

        const imagen_perfil = headerContainer.querySelector('#Taller-image');
        const parametrosURL = new URLSearchParams(window.location.search);
        const idTaller = parametrosURL.get('id');

        if(imagen_perfil){
            if (!idTaller || idTaller == 0 || idTaller === '{{id}}') {
                imagen_perfil.src = "../Fotos/Nuestro logo.png";
            }else{
                const tallerSeleccionado = datos.talleres.find(taller => taller.id == idTaller);
                if(tallerSeleccionado){
                    imagen_perfil.src = `${tallerSeleccionado.image[0]}`;
                }
            }
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
        const contenedor = document.querySelector('#main-content');
        if (!contenedor) return;

        const tallerSeleccionado = datos.talleres.find(taller => taller.id == idTaller);

        if (!idTaller || idTaller == 0 || idTaller === '{{id}}') {

            const rutaFoto = `../Fotos/Fondo pagina.png`;
            contenedor.style.setProperty('--bg-taller', `url('${rutaFoto}')`);

            if (tipo == 'politicas') {
                const politicas = document.querySelector('#main-content');

                if (politicas) {
                    politicas.innerHTML = '';
                    datos.configuracion.politicas.forEach(politica => {
                        politicas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary class="Titulo">${politica.name_politica}</summary>
    
                                                        <div class="content">
                                                            <p class="texto">${politica.politica_texto}</p>
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
                                                        <summary class="Titulo">${pregunta.name_pregunta}</summary>
    
                                                        <div class="content">
                                                            <p class="texto">${pregunta.pregunta_texto}</p>
                                                        </div>
                                                    </details>
                                                </article>`;
                    });
                }
            }

        }else{

            if (contenedor && tallerSeleccionado.image.length > 0) {
                const rutaFoto = `../${tallerSeleccionado.image[0]}`;
                contenedor.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
            }

            if (tipo == 'politicas') {
                const politicas = document.querySelector('#main-content');

                if (politicas) {
                    politicas.innerHTML = '';
                    datos.talleres.forEach(taller => {
                        if (taller.id == idTaller){
                            taller.politicas.forEach(politica => {
                                politicas.innerHTML += `<article class="article-container">
                                                    <details class ="custom-details">
                                                        <summary class="Titulo">${politica.name_politica}</summary>
    
                                                        <div class="content">
                                                            <p class="texto">${politica.politica_texto}</p>
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
                                                        <summary class="Titulo">${pregunta.name_pregunta}</summary>
    
                                                        <div class="content">
                                                            <p class="texto">${pregunta.pregunta_texto}</p>
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

        const respuesta = await fetch('../partials/footer.html');
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