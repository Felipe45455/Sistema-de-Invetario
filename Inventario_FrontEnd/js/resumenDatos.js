// Usamos Fetch API para obtener el total de productos desde la API
const apiUrl =
  "http://localhost/Sistema-de-Invetario/Inventario_API/controller/productoController.php";

document.addEventListener("DOMContentLoaded", function () {
  // Realizamos una solicitud GET agregando el parámetro 'accion=contar' en la URL
  fetch(apiUrl + "?accion=contar", {
    method: "GET", // La solicitud es GET, por lo que no necesitamos un 'body'
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json()) // Convertimos la respuesta a JSON
    .then((data) => {
      // Si la solicitud es exitosa, actualizamos el total de productos
      document.getElementById("totalProductos").textContent = data.total;
    })
    .catch((error) => {
      console.error("Error al obtener el total de productos:", error);
      document.getElementById("totalProductos").textContent = "0"; // En caso de error, se muestra 0
    });
});
