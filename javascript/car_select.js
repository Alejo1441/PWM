document.addEventListener("DOMContentLoaded", async () => {
    await loadCarSelectionPage();
});

async function loadCarSelectionPage() {
    try {
        const response = await fetch("../json/content.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el JSON");
        }

        const data = await response.json();

        loadReservationSummary();
        renderCars(data.currentUser);
        setupConfirmButton();

    } catch (error) {
        console.error("Error cargando car_select:", error);
    }
}

function loadReservationSummary() {
    const reservation = JSON.parse(localStorage.getItem("reservation"));

    if (!reservation) return;

    const dateElement = document.getElementById("reservation-date");
    if (dateElement) {
        dateElement.textContent = `${reservation.date} ${reservation.time}`;
    }
}

function renderCars(user) {
    const carList = document.getElementById("car-list");
    const selectedCarText = document.getElementById("selected-car");

    if (!carList || !user || !user.cars) return;

    carList.innerHTML = "";

    user.cars.forEach((car) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "car-item";
        button.textContent = `${car.name} - ${car.plate}`;

        button.addEventListener("click", () => {
            document.querySelectorAll(".car-item").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            selectedCarText.textContent = `${car.name} - ${car.plate}`;

            localStorage.setItem("selectedCar", JSON.stringify(car));
        });

        carList.appendChild(button);
    });
}

function setupConfirmButton() {
    const confirmBtn = document.getElementById("confirm-reservation");

    if (!confirmBtn) return;

    confirmBtn.addEventListener("click", () => {
        const reservation = JSON.parse(localStorage.getItem("reservation"));
        const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));

        if (!reservation) {
            alert("No hay ninguna reserva seleccionada.");
            return;
        }

        if (!selectedCar) {
            alert("Selecciona primero un vehículo.");
            return;
        }

        alert("Reserva confirmada correctamente");

        localStorage.removeItem("reservation");
        localStorage.removeItem("selectedCar");

        window.location.href = "../pages/Index.html";
    });
}