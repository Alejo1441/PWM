document.addEventListener("DOMContentLoaded", () => {

  const mainContainer = document.querySelector('.profile-container');

  if (mainContainer) {
    const rutaFoto = `../Fotos/Fondo pagina.png`;
    mainContainer.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
  }

  const headerContainer = document.querySelector('#Taller-image');
  if(headerContainer) {
    headerContainer.src = "../Fotos/Nuestro logo.png";
  }

  const sesion = localStorage.getItem('usuario_logeado');
  if (!sesion) {
    window.location.href = "../../partials/log.html";
    return;
  }

  let usuarioActual = JSON.parse(sesion);
  renderDatosUsuarios(usuarioActual);

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

  document.addEventListener('click', (e) => {
    // Si el elemento clicado tiene el ID de nuestro botón de añadir coche...
    if (e.target && e.target.id === 'btn-add-car-open') {
      const modalAddCar = document.getElementById('add-car-dialog');
      if (modalAddCar) {
        modalAddCar.showModal();
      } else {
        console.error("El modal aún no se ha inyectado en el HTML.");
      }
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'form-car') {
      e.preventDefault();

      const inputs = e.target.querySelectorAll('input');
      const modelo = inputs[0].value;
      const marca = inputs[1].value;
      const matricula = inputs[2].value;

      const textoCoche = `${marca} ${modelo} - ${matricula}`;

      usuarioActual = JSON.parse(localStorage.getItem('usuario_logeado'));
      usuarioActual.car.push(textoCoche);
      guardarCambiosUsuario(usuarioActual);

      document.getElementById('add-car-dialog').close();
      e.target.reset();
    }
  });
});

function renderDatosUsuarios(user) {
  // 1. Pintar datos básicos
  const nombre = document.getElementById("user-fullname");
  const email = document.getElementById("user-email");

  if (nombre) nombre.textContent = `${user.username} ${user.lastname}`;
  if (email) email.textContent = user.email;

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

  const listaReservas = document.getElementById("list-bookings");
  if (listaReservas) {
    if (user.bookings && user.bookings.length > 0) {
      listaReservas.innerHTML = user.bookings.map((reserva, index) => `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ccc;">
                    <span>${reserva}</span>
                    <button onclick="eliminarReserva(${index})" class="button-red" style="margin-top: 0; padding: 5px 10px; background-color: #ff3b3b; color: white; border: none; border-radius: 4px; cursor: pointer;">❌ Cancelar</button>
                </li>
            `).join('');
    } else {
      listaReservas.innerHTML = "<li style='padding: 10px 0;'>No tienes reservas.</li>";
    }
  }
}

window.eliminarCoche = function(index) {
  if (confirm("¿Seguro que quieres eliminar este vehículo?")) {
    let usuarioActual = JSON.parse(localStorage.getItem('usuario_logeado'));


    usuarioActual.car.splice(index, 1);

    guardarCambiosUsuario(usuarioActual);
  }
};

window.eliminarReserva = function(index) {
  if (confirm("¿Seguro que quieres cancelar esta reserva?")) {
    let usuarioActual = JSON.parse(localStorage.getItem('usuario_logeado'));

    usuarioActual.bookings.splice(index, 1);


    guardarCambiosUsuario(usuarioActual);
  }
};

function guardarCambiosUsuario(userModificado) {

  localStorage.setItem('usuario_logeado', JSON.stringify(userModificado));


  let baseDatos = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
  const posicionDB = baseDatos.findIndex(u => u.email === userModificado.email);

  if (posicionDB !== -1) {
    baseDatos[posicionDB] = userModificado;
    localStorage.setItem('usuarios_registrados', JSON.stringify(baseDatos));
  }

  renderDatosUsuarios(userModificado);
}

