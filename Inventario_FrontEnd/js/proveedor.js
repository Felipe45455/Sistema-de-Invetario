const apiUrlPv = 'http://localhost/Sistema-de-Invetario/Inventario_API/controller/proveedorController.php?accion=';

// Función para obtener proveedores
function obtenerProveedores() {
    fetch(apiUrlPv + 'listar')
        .then(response => response.json())
        .then(data => {
            const providerTable = document.getElementById('providerTable').getElementsByTagName('tbody')[0];
            providerTable.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos proveedores

            data.forEach(proveedor => {
                const row = providerTable.insertRow();
                row.innerHTML = `
                    <td>${proveedor.id_proveedor}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.telefono}</td>
                    <td>${proveedor.direccion}</td>
                `;
                row.addEventListener('click', () => llenarFormulario(proveedor));
            });
        })
        .catch(error => console.error('Error al obtener proveedores:', error));
}

// Función para llenar el formulario con los datos del proveedor
function llenarFormulario(proveedor) {
    document.getElementById('nombre').value = proveedor.nombre;
    document.getElementById('telefono').value = proveedor.telefono;
    document.getElementById('direccion').value = proveedor.direccion;

    // Activar los botones de editar y eliminar
    document.getElementById('editBtn').disabled = false;
    document.getElementById('deleteBtn').disabled = false;
    document.getElementById('addBtn').disabled = true;

    // Establecer un atributo para identificar el proveedor
    document.getElementById('editBtn').setAttribute('data-id', proveedor.id_proveedor);
    document.getElementById('deleteBtn').setAttribute('data-id', proveedor.id_proveedor);
}

// Función para agregar un nuevo proveedor
function agregarProveedor() {
    const proveedor = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
    };

    fetch(apiUrlPv + 'crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            obtenerProveedores(); // Actualizar la lista de proveedores
            limpiarFormulario();
        })
        .catch(error => console.error('Error al agregar proveedor:', error));
}

// Función para actualizar un proveedor
function actualizarProveedor() {
    const proveedor = {
        id_proveedor: document.getElementById('editBtn').getAttribute('data-id'),
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
    };

    fetch(apiUrlPv + 'actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            obtenerProveedores(); // Actualizar la lista de proveedores
            limpiarFormulario();
            document.getElementById('addBtn').disabled = false;
        })
        .catch(error => console.error('Error al actualizar proveedor:', error));
}

// Función para eliminar un proveedor
function eliminarProveedor() {
    const idProveedor = document.getElementById('deleteBtn').getAttribute('data-id');

    fetch(apiUrlPv + 'eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_proveedor: idProveedor })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            obtenerProveedores(); // Actualizar la lista de proveedores
            limpiarFormulario();
            document.getElementById('addBtn').disabled =false;
        })
        .catch(error => console.error('Error al eliminar proveedor:', error));
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('providerForm').reset();
    document.getElementById('editBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('addBtn').disabled = false;
}

// Inicializar la tabla de proveedores al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerProveedores();
});

// Agregar el evento de clic para los botones
document.getElementById('addBtn').addEventListener('click', agregarProveedor);
document.getElementById('editBtn').addEventListener('click', actualizarProveedor);
document.getElementById('deleteBtn').addEventListener('click', eliminarProveedor);
document.getElementById('clearBtn').addEventListener('click', limpiarFormulario);


// Función para filtrar los proveedores en la tabla
function filtrarProveedores() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Texto del campo de búsqueda
    const providerTable = document.getElementById('providerTable').getElementsByTagName('tbody')[0];
    const rows = providerTable.getElementsByTagName('tr'); // Todas las filas de la tabla

    for (let row of rows) {
        const nombre = row.cells[1].textContent.toLowerCase(); // Columna "Nombre"
        const telefono = row.cells[2].textContent.toLowerCase(); // Columna "Teléfono"
        const direccion = row.cells[3].textContent.toLowerCase(); // Columna "Dirección"

        // Verificar si alguno de los campos contiene el texto de búsqueda
        if (nombre.includes(searchInput) || telefono.includes(searchInput) || direccion.includes(searchInput)) {
            row.style.display = ''; // Mostrar la fila
        } else {
            row.style.display = 'none'; // Ocultar la fila
        }
    }
}

// Agregar el evento de búsqueda al campo
document.getElementById('searchInput').addEventListener('input', filtrarProveedores);
