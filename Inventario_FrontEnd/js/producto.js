// producto.js

const apiUrlPd = 'http://localhost/Sistema-de-Invetario/Inventario_API/controller/productoController.php?accion=';

// Función para obtener productos
function obtenerProductos() {
    fetch(apiUrlPd + 'listar')
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
    document.getElementById('addBtn').disabled = true;

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
    // Capturar y limpiar los valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const precio = parseFloat(document.getElementById('precio').value.trim()); // Faltaba el paréntesis de cierre
    const cantidad = parseInt(document.getElementById('cantidad').value.trim(), 10);
    const id_categoria = parseInt(document.getElementById('categoria').value.trim(), 10);
    const id_proveedor = parseInt(document.getElementById('proveedor').value.trim(), 10);

    console.log("Datos a enviar:", { nombre, descripcion, precio, cantidad, id_categoria, id_proveedor }); // Verifica los datos

    // Validaciones
    if (!nombre || !descripcion) {
        console.warn("Campos de texto vacíos detectados. Operación cancelada.");
        alert('Por favor, completa los campos de nombre y descripción.');
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        console.warn("El precio es inválido o menor o igual a cero. Operación cancelada.");
        alert('Por favor, ingresa un precio válido (número decimal mayor a 0).');
        return;
    }

    if (isNaN(cantidad) || cantidad < 0) {
        console.warn("La cantidad es inválida o menor a cero. Operación cancelada.");
        alert('Por favor, ingresa una cantidad válida (entero mayor o igual a 0).');
        return;
    }

    if (isNaN(id_categoria) || id_categoria <= 0) {
        console.warn("El ID de categoría es inválido o menor o igual a cero. Operación cancelada.");
        alert('Por favor, selecciona una categoría válida.');
        return;
    }

    if (isNaN(id_proveedor) || id_proveedor <= 0) {
        console.warn("El ID de proveedor es inválido o menor o igual a cero. Operación cancelada.");
        alert('Por favor, selecciona un proveedor válido.');
        return;
    }

    // Construir el objeto del producto
    const producto = { 
        nombre, 
        descripcion, 
        precio, // Asegurar el formato de precio como decimal (10,2)
        cantidad, 
        id_categoria, 
        id_proveedor 
    };

    console.log(producto)

    // Realizar la solicitud al API
    fetch(apiUrlPd + 'crear', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(producto),
    })
        .then(response => {
            console.log("Respuesta cruda del servidor:", response); // Verifica la respuesta inicial

            // Validar la respuesta HTTP
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            return response.json(); // Procesar la respuesta JSON
        })
        .then(data => {
            console.log("Respuesta procesada:", data); // Verifica la respuesta JSON

            // Validar el formato de la respuesta
            if (!data || !data.mensaje) {
                throw new Error("La respuesta del servidor no contiene el formato esperado.");
            }

            // Mostrar mensaje de éxito
            alert(data.mensaje);

            // Actualizar la lista de productos y limpiar el formulario
            obtenerProductos();
            limpiarFormulario();
        })
        .catch(error => {
            // Manejo de errores
            console.error("Error al agregar producto:", error);
            alert('Ocurrió un error al agregar el producto. Por favor, intenta nuevamente.');
        });
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

    fetch(apiUrlPd + 'actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        obtenerProductos(); // Actualizar la lista de productos
        limpiarFormulario();
        document.getElementById('addBtn').disabled = false;
    })
    .catch(error => console.error('Error al actualizar producto:', error));

    
}

// Función para eliminar un producto
function eliminarProducto() {
    const idProducto = document.getElementById('deleteBtn').getAttribute('data-id');

    fetch(apiUrlPd + 'eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_producto: idProducto })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        obtenerProductos(); // Actualizar la lista de productos
        limpiarFormulario();
        document.getElementById('addBtn').disabled = false;
    })
    .catch(error => console.error('Error al eliminar producto:', error));

   

    
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('productForm').reset();
    document.getElementById('editBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('addBtn').disabled = false;
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
