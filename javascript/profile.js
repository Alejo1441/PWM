
document.addEventListener("DOMContentLoaded", () => {

    const sesion = localStorage.getItem('usuario_logeado');
    if(sesion){
        const usuario = JSON.parse(sesion);
        renderDatosUsuarios(usuario);
    }else{
        window.location.href = "../partials/log.html"
    }




    const btnCars = document.getElementById('btn-cars');
    const btnBooking = document.getElementById('btn-booking');
    const panelCars = document.getElementById('cars');
    const panelBooking = document.getElementById('booking');

    if (btnCars && btnBooking) {
        btnCars.addEventListener('click', () => {
            btnCars.classList.add('active');
            btnBooking.classList.remove('active');

            panelCars.classList.remove('hide');
            panelBooking.classList.add('hide');
        });
        btnBooking.addEventListener('click', () => {
            btnCars.classList.remove('active');
            btnBooking.classList.add('active');

            panelCars.classList.add('hide');
            panelBooking.classList.remove('hide');
        });

    }



});

function renderDatosUsuarios(user){
    const nombre = document.getElementById("user-fullname");
    const email = document.getElementById('user-email');

    if (nombre) nombre.textContent= user.username;
    if (email)  email.textContent= user.email;

    const listaCoches = document.getElementById("list-cars");
    if (listaCoches){
        listaCoches.innerHTML = user.car.map(c => `<li>${c}</li>`).join('');
    }

    const listaReservas = document.getElementById("list-bookings");
    if (listaReservas){
        if (user.bookings.length > 0){
            listaReservas.innerHTML = user.bookings.map(b => `<li>${b}</li>`).join("");
        }else{
            listaReservas.innerHTML = "<li>No tienes reservas.</li>"
        }
    }
}
