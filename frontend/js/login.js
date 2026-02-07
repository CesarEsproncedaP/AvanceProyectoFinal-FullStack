const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // validación básica
  if (email === "" || password === "") {
    msg.textContent = "Faltan datos";
    return;
  }

  // login simulado
  window.location.href = "dashboard.html";
});

