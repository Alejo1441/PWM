document.addEventListener('DOMContentLoaded',async () => {

    if(!localStorage.getItem("usuarios_registrados")) {
        try {
            const res = await fetch('../json/content.json');
            const data = await res.json();
            // Guardamos los usuarios del JSON en el navegador para poder añadir más
            localStorage.setItem('usuarios_registrados', JSON.stringify(data.usuarios));
        } catch (error) {
            console.error("Error al cargar JSON inicial:", error);
        }
    }


    // 1. Referencias a los Diálogos (Modales)
    const modalAuth = document.getElementById('modal-auth-choice');
    const modalLogin = document.getElementById('modal-login');
    const modalRegType = document.getElementById('modal-reg-type');
    const modalRegForm = document.getElementById('modal-register-form');

    // 2. Referencias a Botones de apertura dentro de los modales
    const btnOpenLogin = document.getElementById('open-login');
    const btnOpenRegChoice = document.getElementById('open-register-choice');
    const btnGoRegClient = document.getElementById('go-reg-client');

    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    // --- LÓGICA DE NAVEGACIÓN ENTRE MODALES ---
    if(btnOpenLogin) btnOpenLogin.onclick = () => { modalAuth.close(); modalLogin.showModal(); };
    if(btnOpenRegChoice) btnOpenRegChoice.onclick = () => { modalAuth.close(); modalRegType.showModal(); };
    if(btnGoRegClient) btnGoRegClient.onclick = () => { modalRegType.close(); modalRegForm.showModal(); };

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            // Ahora leemos la memoria del navegador, no el fetch directo
            const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
            const user = usuariosGuardados.find(u => u.email === email && u.password === pass);

            if (user) {
                localStorage.setItem('usuario_logeado', JSON.stringify(user));
                window.location.href = "../pages/profile.html";
            } else {
                alert("Email o contraseña incorrectos");
            }
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = registerForm.querySelectorAll('input');
            const nombre = inputs[0].value;
            const apellido = inputs[1].value;
            const email = inputs[2].value;
            const muni = inputs[3].value;
            const pass = document.getElementById('reg-pass').value;
            const passConf = document.getElementById('reg-pass-conf').value;

            if (pass !== passConf) {
                alert("Las contraseñas no coinciden");
                return;
            }

            // Traemos la lista actual de usuarios
            let usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];

            // Verificamos que el email no exista ya
            if (usuariosGuardados.find(u => u.email === email)) {
                alert("Este email ya está registrado.");
                return;
            }

            // Creamos el usuario
            const nuevoUsuario = {
                id: Date.now(),
                username: nombre,
                lastname: apellido,
                email: email,
                municipality: muni,
                password: pass,
                rol: "user",
                car: [],
                bookings: []
            };

            // Lo añadimos a la lista y guardamos la lista actualizada
            usuariosGuardados.push(nuevoUsuario);
            localStorage.setItem('usuarios_registrados', JSON.stringify(usuariosGuardados));

            // Iniciamos sesión automáticamente
            localStorage.setItem('usuario_logeado', JSON.stringify(nuevoUsuario));
            alert("Cuenta creada con éxito");
            window.location.href = "../pages/profile.html";
        });
    }

    // --- ESPERAR AL HEADER DINÁMICO ---
    const checkHeader = setInterval(() => {
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            clearInterval(checkHeader);

            // Actualizar nombre si ya está logeado
            actualizarInterfazHeader();

            // Configurar el click del icono de perfil
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                const sesion = localStorage.getItem('usuario_logeado');

                if (sesion) {
                    window.location.href = "../pages/profile.html";
                } else {
                    const modalAuth = document.getElementById('modal-auth-choice');
                    if (modalAuth) modalAuth.showModal();
                    else alert("Error: No se encontró el modal de acceso.");
                }
            });
        }
    }, 100);
});

function actualizarInterfazHeader() {
    const sesion = localStorage.getItem('usuario_logeado');
    const profileLink = document.getElementById('profile-link');
    const btnLogout = document.getElementById('btn-logout');

    if (sesion && profileLink) {
        const usuario = JSON.parse(sesion);

        if (!profileLink.querySelector('.welcome-msg')) {
            const span = document.createElement('span');
            span.className = 'welcome-msg';
            span.style.marginLeft = "10px";
            span.textContent = `Hola, ${usuario.username}`;
            profileLink.appendChild(span);
        }
        if(btnLogout) {
            btnLogout.classList.remove('hidden');

            btnLogout.onclick = () => {
                localStorage.removeItem('usuario_logeado');
                window.location.href = "../pages/index.html";
            };
        }
    } else {
        if (btnLogout) {
            btnLogout.classList.add('hidden');
        }
    }
}