const apiUrl = 'http://localhost/Sistema-de-Invetario/Inventario_API/controller/proveedorController.php?accion=';

// Función para obtener proveedores
function obtenerProveedores() {
    fetch(apiUrl + 'listar')
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

    fetch(apiUrl + 'crear', {
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

    fetch(apiUrl + 'actualizar', {
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

    fetch(apiUrl + 'eliminar', {
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
