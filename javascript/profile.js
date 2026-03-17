document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CARGA INICIAL DEL USUARIO ---
    const sesion = localStorage.getItem('usuario_logeado');
    if (!sesion) {
        window.location.href = "../partials/log.html"; // Redirigir si no hay sesión
        return; //CAMBIAR
    }

    let usuarioActual = JSON.parse(sesion);
    renderDatosUsuarios(usuarioActual);

    // --- 2. GESTIÓN DE PESTAÑAS (TABS) ---
    const btnCars = document.getElementById('btn-cars');
    const btnBooking = document.getElementById('btn-booking');
    const panelCars = document.getElementById('cars');
    const panelBooking = document.getElementById('booking');

    if (btnCars && btnBooking) {
        btnCars.addEventListener('click', () => {
            btnCars.classList.add('active'); btnBooking.classList.remove('active');
            panelCars.classList.remove('hide'); panelBooking.classList.add('hide');
        });
        btnBooking.addEventListener('click', () => {
            btnCars.classList.remove('active'); btnBooking.classList.add('active');
            panelCars.classList.add('hide'); panelBooking.classList.remove('hide');
        });
    }

    // --- 3. DELEGACIÓN DE EVENTOS (ABRIR MODAL Y ENVIAR FORMULARIO) ---

    // Escuchar TODOS los clics de la página
    document.addEventListener('click', (e) => {
        // Si el elemento clicado tiene el ID de nuestro botón de añadir coche...
        if (e.target && e.target.id === 'btn-add-car-open') {
            const modalAddCar = document.getElementById('add-car');
            if (modalAddCar) {
                modalAddCar.showModal();
            } else {
                console.error("El modal aún no se ha inyectado en el HTML.");
            }
        }
    });

    // Escuchar TODOS los envíos de formularios de la página
    document.addEventListener('submit', (e) => {
        // Si el formulario enviado es el de nuestro modal...
        if (e.target && e.target.id === 'form-car') {
            e.preventDefault(); // Evita que la página se recargue al enviar

            // Capturamos los inputs dentro de este formulario concreto
            const inputs = e.target.querySelectorAll('input');
            const modelo = inputs[0].value;
            const marca = inputs[1].value;
            const matricula = inputs[2].value;

            // Formateamos cómo queremos que se guarde
            const textoCoche = `${marca} ${modelo} - ${matricula}`;

            // Refrescamos la variable del usuario actual y le añadimos el coche al array
            usuarioActual = JSON.parse(localStorage.getItem('usuario_logeado'));
            usuarioActual.car.push(textoCoche);

            // Guardamos los cambios
            guardarCambiosUsuario(usuarioActual);

            // Cerramos el modal y reseteamos los campos
            document.getElementById('add-car').close();
            e.target.reset();
        }
    });
});

// --- FUNCIONES AUXILIARES ---

function renderDatosUsuarios(user) {
    // 1. Pintar datos básicos
    const nombre = document.getElementById("user-fullname");
    const email = document.getElementById("user-email");

    if (nombre) nombre.textContent = `${user.username} ${user.lastname}`;
    if (email) email.textContent = user.email;

    // 2. Pintar la lista de coches (Con botón de eliminar dinámico)
    const listaCoches = document.getElementById("list-cars");
    if (listaCoches) {
        if (user.car && user.car.length > 0) {
            listaCoches.innerHTML = user.car.map((coche, index) => `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ccc;">
                    <span>${coche}</span>
                    <button onclick="eliminarCoche(${index})" class="button-red" style="margin-top: 0; padding: 5px 10px;">❌ Eliminar</button>
                </li>
            `).join('');
        } else {
            listaCoches.innerHTML = "<li style='padding: 10px 0;'>No tienes vehículos registrados.</li>";
        }
    }

    // 3. Pintar reservas
    const listaReservas = document.getElementById("list-bookings");
    if (listaReservas) {
        if (user.bookings && user.bookings.length > 0) {
            listaReservas.innerHTML = user.bookings.map(b => `<li>${b}</li>`).join("");
        } else {
            listaReservas.innerHTML = "<li style='padding: 10px 0;'>No tienes reservas.</li>";
        }
    }
}

// Función global para eliminar un coche según su posición en el array (index)
window.eliminarCoche = function(index) {
    if (confirm("¿Seguro que quieres eliminar este vehículo?")) {
        let usuarioActual = JSON.parse(localStorage.getItem('usuario_logeado'));

        // El método splice elimina 1 elemento en la posición "index"
        usuarioActual.car.splice(index, 1);

        guardarCambiosUsuario(usuarioActual);
    }
};

// Función maestra para guardar la información y repintar la pantalla
function guardarCambiosUsuario(userModificado) {
    // Actualizar la sesión actual
    localStorage.setItem('usuario_logeado', JSON.stringify(userModificado));

    // Buscar al usuario en la "base de datos" general y actualizarlo ahí también
    let baseDatos = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
    const posicionDB = baseDatos.findIndex(u => u.email === userModificado.email);

    if (posicionDB !== -1) {
        baseDatos[posicionDB] = userModificado;
        localStorage.setItem('usuarios_registrados', JSON.stringify(baseDatos));
    }

    // Volver a dibujar la interfaz con los datos nuevos (sin recargar)
    renderDatosUsuarios(userModificado);
}