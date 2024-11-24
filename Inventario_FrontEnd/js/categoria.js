const apiUrl = 'http://localhost/Sistema-de-Invetario/Inventario_API/controller/categoriaController.php?accion=';

// Función para obtener categorías
function obtenerCategorias() {
    fetch(apiUrl + 'listar')
        .then(response => response.json())
        .then(data => {
            const categoryTable = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
            categoryTable.innerHTML = ''; // Limpiar la tabla antes de agregar las nuevas categorías

            data.forEach(categoria => {
                const row = categoryTable.insertRow();
                row.innerHTML = `
                    <td>${categoria.id_categoria}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                `;
                row.addEventListener('click', () => llenarFormulario(categoria));
            });
        })
        .catch(error => console.error('Error al obtener categorías:', error));
}

// Función para llenar el formulario con los datos de la categoría
function llenarFormulario(categoria) {
    document.getElementById('nombre').value = categoria.nombre;
    document.getElementById('descripcion').value = categoria.descripcion;

    // Activar los botones de editar y eliminar
    document.getElementById('editBtn').disabled = false;
    document.getElementById('deleteBtn').disabled = false;
    document.getElementById('addBtn').disabled = true;

    // Establecer un atributo para identificar la categoría
    document.getElementById('editBtn').setAttribute('data-id', categoria.id_categoria);
    document.getElementById('deleteBtn').setAttribute('data-id', categoria.id_categoria);
}

function agregarCategoria() {
    // Capturar y limpiar los valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    // Mostrar los datos que se enviarán (para depuración)
    console.log("Datos a enviar:", { nombre, descripcion });

    // Validación de campos vacíos
    if (!nombre || !descripcion) {
        console.warn("Campos vacíos detectados. Operación cancelada.");
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Construir el objeto a enviar
    const categoria = { nombre, descripcion };

    // Realizar la solicitud al API
    fetch(apiUrl + 'crear', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(categoria),
    })
        .then(response => {
            console.log("Respuesta cruda del servidor:", response);

            // Verificar si la respuesta es satisfactoria
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
            
            return response.json(); // Procesar la respuesta JSON
        })
        .then(data => {
            console.log("Respuesta procesada:", data);

            // Validar el formato de la respuesta
            if (!data || !data.mensaje) {
                throw new Error("La respuesta del servidor no contiene el formato esperado.");
            }

            // Mostrar mensaje de éxito
            alert(data.mensaje);

            // Actualizar la lista de categorías y limpiar el formulario
            obtenerCategorias();
            limpiarFormulario();
        })
        .catch(error => {
            // Manejar errores en la consola y mostrar alerta al usuario
            console.error("Error al agregar categoría:", error);
            alert('Ocurrió un error al agregar la categoría. Por favor, intenta nuevamente.');
        });
}


// Función para actualizar una categoría
function actualizarCategoria() {
    const categoria = {
        id_categoria: document.getElementById('editBtn').getAttribute('data-id'),
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
    };

    fetch(apiUrl + 'actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            obtenerCategorias(); // Actualizar la lista de categorías
            limpiarFormulario();
            document.getElementById('addBtn').disabled = false;

        })
        .catch(error => console.error('Error al actualizar categoría:', error));
}

// Función para eliminar una categoría
function eliminarCategoria() {
    const idCategoria = document.getElementById('deleteBtn').getAttribute('data-id');

    fetch(apiUrl + 'eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_categoria: idCategoria })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            obtenerCategorias(); // Actualizar la lista de categorías
            limpiarFormulario();
            document.getElementById('addBtn').disabled = false;
        })
        .catch(error => console.error('Error al eliminar categoría:', error));
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('categoryForm').reset();
    document.getElementById('editBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('addBtn').disabled = false;
}

// Inicializar la tabla de categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerCategorias();
});

// Agregar el evento de clic para los botones
document.getElementById('addBtn').addEventListener('click', agregarCategoria);
document.getElementById('editBtn').addEventListener('click', actualizarCategoria);
document.getElementById('deleteBtn').addEventListener('click', eliminarCategoria);
document.getElementById('clearBtn').addEventListener('click', limpiarFormulario);
