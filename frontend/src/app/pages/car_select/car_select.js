
window.addEventListener("load", async () => {
  await cargarComponentesBase();
  const carList = document.getElementById("car-list");
  const selectedText = document.getElementById("selectedCar");
  const dateElement = document.getElementById("reservation-date");
  const confirmBtn = document.getElementById("confirm-reservation");
  const typeServiceElement = document.getElementById("info-servicio-taller");

  const sesion = JSON.parse(localStorage.getItem("usuario_logeado"));
  if(!sesion){
    window.location.href = "../../../../../old_code/Index.html";
    return;
  }
  const reservation = JSON.parse(localStorage.getItem("reservation"));
  const parametrosURL = new URLSearchParams(window.location.search);

  const respuesta = await fetch('../json/content.json');
  if (!respuesta.ok) throw new Error("Error al cargar el JSON");
  const datos = await respuesta.json();

  const idActual = parametrosURL.get('id');
  const servicioActual = parametrosURL.get('especialidad');

  const tallerseleccionado = datos.talleres.find(taller => taller.id == idActual);
  const mainContainer = document.querySelector('.page');

  if(tallerseleccionado){
    if (mainContainer && tallerseleccionado.image.length > 0) {
      const rutaFoto = `../${tallerseleccionado.image[0]}`;
      mainContainer.style.setProperty('--bg-taller', `url('${rutaFoto}')`);
    }
  }

  if (reservation){
    dateElement.textContent = `${reservation.date} a las ${reservation.time}`;
    const priceElement = document.querySelector(".price");


    if(tallerseleccionado && servicioActual){
      // 🔥 CAMBIO 2: Limpiamos los textos de espacios e invisibles y pasamos a minúsculas
      const servicioLimpio = servicioActual.trim().toLowerCase();
      const servicioseleccionado = tallerseleccionado.speciality.find(servicio =>
        servicio.service.trim().toLowerCase() === servicioLimpio
      );

      if(servicioseleccionado){
        if (typeServiceElement){
          typeServiceElement.innerHTML = `<p><strong>Taller:</strong> ${tallerseleccionado.name}</p>
                                                    <p><strong>Tipo de servicio:</strong> ${servicioseleccionado.service}</p>`;
        }

        if (priceElement){
          priceElement.textContent = `${servicioseleccionado.price} €`;
        }
      }
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

      window.location.href = "../../pages/profile.html";
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
async function cargarComponentesBase() {
  try {
    const resJson = await fetch('../json/content.json');
    const datos = await resJson.json();

    const headerContainer = document.getElementById('site-header');
    const resHeader = await fetch('../partials/Header.html');
    headerContainer.innerHTML = await resHeader.text();

    const parametrosURL = new URLSearchParams(window.location.search);
    const idTaller = parametrosURL.get('id');

    if (!idTaller) throw new Error("Falta el ID del taller en la URL");
    const tallerSeleccionado = datos.talleres.find(taller => taller.id == idTaller);

    if(tallerSeleccionado){
      const imagen_perfil = headerContainer.querySelector('#Taller-image');
      if(imagen_perfil){
        imagen_perfil.src = `${tallerSeleccionado.image[0]}`;
      }
    }

    const resFooter = await fetch('../partials/footer.html');
    let footerHtml = await resFooter.text();

    document.getElementById('site-footer').innerHTML = footerHtml.replaceAll('{{id}}', '0');

  } catch (e) {
    console.error("Error cargando componentes:", e);
  }
}
