document.addEventListener("DOMContentLoaded", () => {
    const carList = document.getElementById("car-list");
    const selectedText = document.getElementById("selectedCar");
    const dateElement = document.getElementById("reservation-date");
    const confirmBtn = document.getElementById("confirm-reservation");
    const typeServiceElement = document.querySelector(".summary p:nth-child(2)");

    const sesion = JSON.parse(localStorage.getItem("usuario_logeado"));
    if(!sesion){
        window.location.href = "../index.html";
        return;
    }
    const reservation = JSON.parse(localStorage.getItem("reservation"));
    if (reservation){
        dateElement.textContent = `${reservation.date} a las ${reservation.time}`;
        if (typeServiceElement){
            typeServiceElement.innerHTML = `<strong>Taller:</strong> ${reservation.taller}`;
        }
    }

    if (carList) {

        carList.innerHTML = "";
        if (!sesion.car || sesion.car.length === 0) {
            carList.innerHTML += "<p>  sin coches, vaya al perfil para agregar uno. </p>";
        }else{
            sesion.car.forEach((carString) =>{
               const button = document.createElement("button");
               button.type ="button";
               button.className ="car-item";
               button.textContent = carString;

               button.addEventListener("click", () => {
                  document.querySelectorAll(".car-item").forEach(item => item.classList.remove("active"));
                  button.classList.add("active");
                  selectedText.textContent = carString;
                  localStorage.setItem("selectedCar", carString);
               });
               carList.appendChild(button);
            });

        }

    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const selectedCar = localStorage.getItem("selectedCar");

            if (!reservation) {
                alert("No hay ninguna reserva seleccionada.");
                return;
            }

            if (!selectedCar) {
                alert("Selecciona primero un vehículo.");
                return;
            }
            const nuevaReservaTexto = `${reservation.taller}: ${selectedCar} - ${reservation.date} (${reservation.time})`;

            sesion.bookings = sesion.bookings || [];
            sesion.bookings.push(nuevaReservaTexto);

            guardarRervaEnDB(sesion);

            alert("Reserva confirmada correctamente, podras verla en el perfil");
            localStorage.removeItem("reservation");
            localStorage.removeItem("selectedCar");
            localStorage.removeItem("temp_taller_name");

            window.location.href = "../pages/profile.html";
        });
    }
});

function guardarRervaEnDB(userModificado){
    localStorage.setItem('usuario_logeado', JSON.stringify(userModificado));

    let baseDatos= JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
    const index = baseDatos.findIndex(u => u.email === userModificado.email);

    if (index !== -1) {
        baseDatos[index] = userModificado;
        localStorage.setItem('usuarios_registrados', JSON.stringify(baseDatos));
    }
}