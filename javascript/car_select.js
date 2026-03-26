document.addEventListener("DOMContentLoaded", () => {
    const carList = document.getElementById("car-list");
    const selectedText = document.getElementById("selectedCar");
    const dateElement = document.getElementById("reservation-date");
    const confirmBtn = document.getElementById("confirm-reservation");
    const serviceElement = document.getElementById("selected-service");
    const priceElement = document.getElementById("selected-price");

    if (dateElement) {
        const reservation = JSON.parse(localStorage.getItem("reservation"));
        if (reservation) {
            dateElement.textContent = `${reservation.date} ${reservation.time}`;
        }
    }

    const selectedService = JSON.parse(localStorage.getItem("selectedService"));
    if (selectedService) {
        if (serviceElement) {
            serviceElement.textContent = selectedService.serviceName;
        }

        if (priceElement) {
            priceElement.textContent = `${selectedService.price} €`;
        }
    }

    if (carList) {
        const cars = [
            { name: "Seat Ibiza", plate: "1234 ABC" },
            { name: "Toyota Yaris", plate: "5678 DEF" },
            { name: "Renault Clio", plate: "9012 GHI" }
        ];

        carList.innerHTML = "";

        cars.forEach((car) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "car-item";
            button.textContent = `${car.name} - ${car.plate}`;

            button.addEventListener("click", () => {
                document.querySelectorAll(".car-item").forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                if (selectedText) {
                    selectedText.textContent = `${car.name} - ${car.plate}`;
                }

                localStorage.setItem("selectedCar", JSON.stringify(car));
            });

            carList.appendChild(button);
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const reservation = JSON.parse(localStorage.getItem("reservation"));
            const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
            const selectedService = JSON.parse(localStorage.getItem("selectedService"));

            if (!reservation) {
                alert("No hay ninguna reserva seleccionada.");
                return;
            }

            if (!selectedCar) {
                alert("Selecciona primero un vehículo.");
                return;
            }

            if (!selectedService) {
                alert("Selecciona primero un servicio.");
                return;
            }

            alert("Reserva confirmada correctamente");

            localStorage.removeItem("reservation");
            localStorage.removeItem("selectedCar");
            localStorage.removeItem("selectedService");

            window.location.href = "../pages/Index.html";
        });
    }
});