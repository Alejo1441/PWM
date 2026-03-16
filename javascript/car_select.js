document.addEventListener("DOMContentLoaded", () => {

    const reservation = JSON.parse(localStorage.getItem("reservation"));

    if (reservation) {
        const dateElement = document.getElementById("reservation-date");

        if (dateElement) {
            dateElement.textContent = reservation.date + " " + reservation.time;
        }
    }

    const confirmBtn = document.getElementById("confirm-reservation");

    confirmBtn.addEventListener("click", () => {

        // opcional: borrar la reserva guardada
        localStorage.removeItem("reservation");

        // redirigir al inicio
        window.location.href = "../pages/Index.html";
    });

});