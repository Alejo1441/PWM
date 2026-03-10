document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const errorMsg = document.getElementById('auth-error');


    //LOGIN
    async function handleLogin(){
        try{
            const res = await fetch('../json/content.json');
            const data = await res.json();
            const usuarios = data.usuarios;

            const user = usuarios.find(u => u.email === emailInput.value && u.password === passInput.value);

            if (user){
                localStorage.setItem('usuario_logeado', JSON.stringify(user));
                window.location.href= "../pages/profile.html"
            }else {
                showError("Email o contraseña incorrectos")
            }

        }catch (e){
            showError("Email o contraseñas incorrectos");
        }
    }


    // REGISTRO
    function handleSignup(){
        if (!emailInput.checkValidity() || !passInput.checkValidity()){
            showError("Por favor, rellena los campos correctamente");
            return;
        }
        const nuevoUsuario = {
            id: Date.now(),
            username: emailInput.value.split('@')[0],
            lastname: "",
            email: emailInput.value,
            municipality: "No definido",
            password: passInput.value,
            rol: "user",
            car: [],
            bookings: []
        };
        localStorage.setItem('usuario_logeado', JSON.stringify(nuevoUsuario));
        alert("¡Cuenta creada con exito!");
        window.location.href = "../pages/profile.html";

    }
    function showError(){
        errorMsg.textContent = txt;
        errorMsg.style.display = 'block';
    }
    if(btnLogin) btnLogin.addEventListener('click',handleLogin);
    if(btnSignup) btnSignup.addEventListener('click', handleSignup);
});