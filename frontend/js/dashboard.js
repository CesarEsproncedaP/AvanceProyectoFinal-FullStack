const lista = document.getElementById("listaGastos");
const btn = document.getElementById("btnAgregar");

btn.addEventListener("click", () => {
  const desc = document.getElementById("nuevoGasto").value;
  const monto = document.getElementById("monto").value;

  if (desc === "" || monto === "") return;

  const item = document.createElement("li");
  item.innerHTML = `${desc} - $${monto}`;

  const borrar = document.createElement("button");
  borrar.textContent = "X";

  borrar.addEventListener("click", () => {
    item.remove();
  });

  item.appendChild(borrar);
  lista.appendChild(item);

  document.getElementById("nuevoGasto").value = "";
  document.getElementById("monto").value = "";
});

