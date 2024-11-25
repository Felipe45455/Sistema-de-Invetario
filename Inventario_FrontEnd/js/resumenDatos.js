const apiUrlProductos = "http://apiprueba.42web.io/Inventario_API/controller/productoController.php";
const apiUrlCategorias = "http://apiprueba.42web.io/Inventario_API/controller/categoriaController.php";
const apiUrlProveedores = "http://apiprueba.42web.io/Inventario_API/controller/proveedorController.php";


document.addEventListener("DOMContentLoaded", function () {
    // Obtener total de productos
    fetch(apiUrlProductos + "?accion=contar", {
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

    // Obtener total de categorías
    fetch(apiUrlCategorias + "?accion=contar", {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json()) 
        .then((data) => {
            document.getElementById("totalCategorias").textContent = data.total;
        })
        .catch((error) => {
            console.error("Error al obtener el total de categorías:", error);
            document.getElementById("totalCategorias").textContent = "0";
        });

    // Obtener total de proveedores
    fetch(apiUrlProveedores + "?accion=contar", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("totalProveedores").textContent = data.total;
            console.log(data)
        })
        .catch((error) => {
            console.error("Error al obtener el total de proveedores:", error);
            document.getElementById("totalProveedores").textContent = "0";
        });
});