var togglePassword = document.querySelector('#togglePassword');
var password = document.querySelector('#password');

togglePassword.addEventListener("click", event => {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye / eye slash icon
    console.log("clicked");
    togglePassword.classList.toggle('bi-eye');
});