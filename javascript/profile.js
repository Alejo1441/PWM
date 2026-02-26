
document.addEventListener("DOMContentLoaded", () => {
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
