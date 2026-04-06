
const ruta = window.location.pathname;
const enSubcarpeta = ruta.includes('/pages/') || ruta.includes('/partials/');

const prefijo = enSubcarpeta ? '../' : './';
const rutaPerfil = enSubcarpeta ? '../pages/profile.html' : './pages/profile.html';
const rutaIndex = enSubcarpeta ? '../index.html' : './index.html';

document.addEventListener('DOMContentLoaded', async () => {

    if(!localStorage.getItem("usuarios_registrados")) {
        try {
            const res = await fetch(prefijo + 'json/content.json');
            const data = await res.json();
            localStorage.setItem('usuarios_registrados', JSON.stringify(data.usuarios));
        } catch (error) {
            console.error("Error al cargar JSON inicial:", error);
        }
    }


    const modalAuth = document.getElementById('modal-auth-choice');
    const modalLogin = document.getElementById('modal-login');
    const modalRegType = document.getElementById('modal-reg-type');
    const modalRegForm = document.getElementById('modal-register-form');

    const btnOpenLogin = document.getElementById('open-login');
    const btnOpenRegChoice = document.getElementById('open-register-choice');
    const btnGoRegClient = document.getElementById('go-reg-client');
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if(btnOpenLogin) btnOpenLogin.onclick = () => { modalAuth.close(); modalLogin.showModal(); };
    if(btnOpenRegChoice) btnOpenRegChoice.onclick = () => { modalAuth.close(); modalRegType.showModal(); };
    if(btnGoRegClient) btnGoRegClient.onclick = () => { modalRegType.close(); modalRegForm.showModal(); };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
            const user = usuariosGuardados.find(u => u.email === email && u.password === pass);

            if (user) {
                localStorage.setItem('usuario_logeado', JSON.stringify(user));
                window.location.href = rutaPerfil; // Usa la ruta inteligente
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

            let usuariosGuardados = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];

            if (usuariosGuardados.find(u => u.email === email)) {
                alert("Este email ya está registrado.");
                return;
            }

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

            usuariosGuardados.push(nuevoUsuario);
            localStorage.setItem('usuarios_registrados', JSON.stringify(usuariosGuardados));
            localStorage.setItem('usuario_logeado', JSON.stringify(nuevoUsuario));

            alert("Cuenta creada con éxito");
            window.location.href = rutaPerfil;
        });
    }

    const checkHeader = setInterval(() => {
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            clearInterval(checkHeader);

            actualizarInterfazHeader();

            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                const sesion = localStorage.getItem('usuario_logeado');

                if (sesion) {
                    window.location.href = rutaPerfil; // Usa la ruta inteligente
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
            profileLink.prepend(span);
        }
        if(btnLogout) {
            btnLogout.classList.remove('hidden');

            btnLogout.onclick = () => {
                localStorage.removeItem('usuario_logeado');
                window.location.href = rutaIndex;
            };
        }
    } else {
        if (btnLogout) {
            btnLogout.classList.add('hidden');
        }
    }
}