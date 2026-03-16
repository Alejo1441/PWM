document.addEventListener('DOMContentLoaded', () => {
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
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            try {
                const res = await fetch('../json/content.json');
                const data = await res.json();
                const user = data.usuarios.find(u => u.email === email && u.password === pass);

                if (user) {
                    localStorage.setItem('usuario_logeado', JSON.stringify(user));
                    window.location.href = "../pages/profile.html";
                } else {
                    alert("Email o contraseña incorrectos");
                }
            } catch (error) { console.error("Error:", error); }
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

    if (sesion && profileLink) {
        const usuario = JSON.parse(sesion);
        if (!profileLink.querySelector('.welcome-msg')) {
            const span = document.createElement('span');
            span.className = 'welcome-msg';
            span.style.marginLeft = "10px";
            span.textContent = `Hola, ${usuario.username}`;
            profileLink.appendChild(span);
        }
    }
}