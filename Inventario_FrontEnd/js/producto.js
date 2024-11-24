// producto.js

const apiUrl = 'http://localhost/Sistema-de-Invetario/Inventario_API/controller/productoController.php?accion=';

// Función para obtener productos
function obtenerProductos() {
    fetch(apiUrl + 'listar')
        .then(response => response.json())
        .then(data => {
            const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
            productTable.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos productos

            data.forEach(producto => {
                const row = productTable.insertRow();
                row.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.proveedor}</td>
                `;
                row.addEventListener('click', () => llenarFormulario(producto));
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

// Función para llenar el formulario con los datos del producto
function llenarFormulario(producto) {
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('cantidad').value = producto.cantidad;
    document.getElementById('categoria').value = producto.id_categoria;
    document.getElementById('proveedor').value = producto.id_proveedor;
    console.log("Producto.id_categoria",producto.id_categoria);
    console.log("Producto.id_proveedor",producto.id_proveedor);
    console.log("Producto Completo",producto);

    // Activar los botones de editar y eliminar
    document.getElementById('editBtn').disabled = false;
    document.getElementById('deleteBtn').disabled = false;

    // Establecer un atributo para identificar el producto
    document.getElementById('editBtn').setAttribute('data-id', producto.id_producto);
    document.getElementById('deleteBtn').setAttribute('data-id', producto.id_producto);
}


function obtenerCategorias() {
    // Realizar la solicitud a la API para obtener las categorías
    fetch("http://localhost/Sistema-de-Invetario/Inventario_API/controller/categoriaController.php?accion=listar")
        .then(response => response.json())
        .then(data => {
            // Obtener el select de categorías
            const categoriaSelect = document.getElementById('categoria');
            // Limpiar las opciones existentes
            categoriaSelect.innerHTML = '<option value="">Seleccione...</option>';

            // Recorrer los datos obtenidos y agregar las opciones al select
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria; // Valor de la opción
                option.textContent = categoria.nombre; // Texto visible de la opción
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener las categorías:', error);
        });
}

function obtenerProveedores() {
    // Realizar la solicitud a la API para obtener los proveedores
    fetch("http://localhost/Sistema-de-Invetario/Inventario_API/controller/proveedorController.php?accion=listar")
        .then(response => response.json())
        .then(data => {
            // Obtener el select de proveedores
            const proveedorSelect = document.getElementById('proveedor');
            // Limpiar las opciones existentes
            proveedorSelect.innerHTML = '<option value="">Seleccione...</option>';

            // Recorrer los datos obtenidos y agregar las opciones al select
            data.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor.id_proveedor; // Valor de la opción
                option.textContent = proveedor.nombre; // Texto visible de la opción
                proveedorSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener los proveedores:', error);
        });
}

// Función para agregar un nuevo producto
function agregarProducto() {
    const producto = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        id_categoria: parseInt(document.getElementById('categoria').value),
        id_proveedor: parseInt(document.getElementById('proveedor').value)
    };

    fetch(apiUrl + 'crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        obtenerProductos(); // Actualizar la lista de productos
        limpiarFormulario();
    })
    .catch(error => console.error('Error al agregar producto:', error));
}

// Función para actualizar un producto
function actualizarProducto() {
    const producto = {
        id_producto: document.getElementById('editBtn').getAttribute('data-id'),
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        id_categoria: parseInt(document.getElementById('categoria').value),
        id_proveedor: parseInt(document.getElementById('proveedor').value)
    };

    fetch(apiUrl + 'actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        obtenerProductos(); // Actualizar la lista de productos
        limpiarFormulario();
    })
    .catch(error => console.error('Error al actualizar producto:', error));
}

// Función para eliminar un producto
function eliminarProducto() {
    const idProducto = document.getElementById('deleteBtn').getAttribute('data-id');

    fetch(apiUrl + 'eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_producto: idProducto })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        obtenerProductos(); // Actualizar la lista de productos
        limpiarFormulario();
    })
    .catch(error => console.error('Error al eliminar producto:', error));
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('productForm').reset();
    document.getElementById('editBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
}

// Inicializar la tabla de productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerCategorias();
    obtenerProveedores();
    obtenerProductos();
});

// Agregar el evento de clic para los botones
document.getElementById('addBtn').addEventListener('click', agregarProducto);
document.getElementById('editBtn').addEventListener('click', actualizarProducto);
document.getElementById('deleteBtn').addEventListener('click', eliminarProducto);
document.getElementById('clearBtn').addEventListener('click', limpiarFormulario);
