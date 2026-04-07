let calendarData = null;
let currentDate = new Date();
let selectedDate = null;

document.addEventListener("DOMContentLoaded", async () => {

  const parametrosURL = new URLSearchParams(window.location.search);
  const respuesta = await fetch('../json/content.json');
  if (!respuesta.ok) throw new Error("Error al cargar el JSON");
  const datos = await respuesta.json();



  const idActual = parametrosURL.get('id');

  const tallerseleccionado = datos.talleres.find(taller => taller.id == idActual);
  const mainContainer = document.querySelector('.page');
  const headerContainer = document.querySelector('#Taller-image');

  if(tallerseleccionado){
    if (mainContainer && tallerseleccionado.image.length > 0) {
      const rutaFoto = `../${tallerseleccionado.image[0]}`;
      mainContainer.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
    }

    if(headerContainer && tallerseleccionado.image.length > 0) {
      headerContainer.src = `${tallerseleccionado.image[0]}`;
    }

  }

  await loadCalendarData();
  initializeCalendar();

});

async function loadCalendarData() {
  try {
    const response = await fetch("../json/content.json");
    const data = await response.json();

    const params = new URLSearchParams(window.location.search);
    const idTaller = params.get('id');
    const servicio = params.get('servicio');

    const taller = data.talleres.find(t => t.id ==idTaller);

    const title = document.getElementById("calendar-title");
    if (taller) {
      const nombreCompleto =`${taller.name} (${servicio})`;
      title.textContent = `Reservar cita en: ${taller.name}`;
      localStorage.setItem("temp_taller_name", taller.name);
    }


    calendarData = data.calendar;
  } catch (error) {
    console.error("Error cargando el calendario:", error);
  }
}

function initializeCalendar() {
  if (!calendarData) return;

  const title = document.getElementById("calendar-title");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const reserveBtn = document.getElementById("reserve-btn");

  reserveBtn.addEventListener("click", () => {

    if (!selectedDate) {
      alert("Selecciona una fecha primero");
      return;
    }

    const selectedSlot = document.querySelector(".slot.selected");

    if (!selectedSlot) {
      alert("Selecciona una hora disponible");
      return;
    }

    const reservation = {
      date: selectedDate,
      time: selectedSlot.dataset.time,
      taller: localStorage.getItem("temp_taller_name") || "Taller"
    };


    localStorage.setItem("reservation", JSON.stringify(reservation));
    const parametrosActuales = window.location.search;

    window.location.href = "../pages/car_select.html" + parametrosActuales;
  });



  fillMonthSelect(monthSelect);
  fillYearSelect(yearSelect);

  monthSelect.value = currentDate.getMonth();
  yearSelect.value = currentDate.getFullYear();

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    syncSelectors();
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    syncSelectors();
    renderCalendar();
  });

  monthSelect.addEventListener("change", () => {
    currentDate.setMonth(parseInt(monthSelect.value));
    renderCalendar();
  });

  yearSelect.addEventListener("change", () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
  });

  reserveBtn.addEventListener("click", () => {
    if (!selectedDate) {
      alert("Selecciona primero una fecha.");
      return;
    }

    const selectedSlot = document.querySelector(".slot.selected");
    if (!selectedSlot) {
      alert("Selecciona primero una hora disponible.");
      return;
    }

    alert(`Reserva seleccionada:\nFecha: ${selectedDate}\nHora: ${selectedSlot.dataset.time}`);
  });

  renderCalendar();
}

function fillMonthSelect(select) {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  select.innerHTML = "";
  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    select.appendChild(option);
  });
}

function fillYearSelect(select) {
  select.innerHTML = "";

  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 1; year <= currentYear + 3; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }
}

function syncSelectors() {
  document.getElementById("month-select").value = currentDate.getMonth();
  document.getElementById("year-select").value = currentDate.getFullYear();
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayString = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "empty-day";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDate(year, month, day);

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "day";
    dayButton.textContent = day;
    dayButton.dataset.date = dateString;

    if (dateString === todayString) {
      dayButton.classList.add("today");
    }

    dayButton.addEventListener("click", () => {
      document.querySelectorAll(".day.selected").forEach(el => el.classList.remove("selected"));
      dayButton.classList.add("selected");

      selectedDate = dateString;
      renderSlots(dateString);
      updateSelectedDateText(dateString);
    });

    grid.appendChild(dayButton);
  }

  if (
    today.getFullYear() === year &&
    today.getMonth() === month
  ) {
    selectedDate = todayString;
  } else {
    selectedDate = formatDate(year, month, 1);
  }

  const autoSelectedDay = grid.querySelector(`[data-date="${selectedDate}"]`);
  if (autoSelectedDay) {
    autoSelectedDay.classList.add("selected");
  }

  renderSlots(selectedDate);
  updateSelectedDateText(selectedDate);
}

function renderSlots(dateString) {
  const slotsGrid = document.getElementById("slots-grid");
  slotsGrid.innerHTML = "";

  const reservedSlots = calendarData.reservedSlots[dateString] || [];
  const startHour = calendarData.startHour;
  const endHour = calendarData.endHour;

  for (let hour = startHour; hour < endHour; hour++) {
    const start = `${String(hour).padStart(2, "0")}:00`;
    const end = `${String(hour + 1).padStart(2, "0")}:00`;
    const slotText = `${start}-${end}`;

    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "slot";
    slot.textContent = slotText;
    slot.dataset.time = slotText;

    if (reservedSlots.includes(slotText)) {
      slot.classList.add("busy");
      slot.disabled = true;
    } else {
      slot.classList.add("available");
      slot.addEventListener("click", () => {
        document.querySelectorAll(".slot.selected").forEach(el => el.classList.remove("selected"));
        slot.classList.add("selected");
      });
    }

    slotsGrid.appendChild(slot);
  }
}

function updateSelectedDateText(dateString) {
  const selectedDateText = document.getElementById("selected-date-text");
  selectedDateText.textContent = `Fecha seleccionada: ${dateString}`;
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
