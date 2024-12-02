<?php
ini_set('display_errors', 1); // Mostrar errores de PHP
error_reporting(E_ALL); // Reportar todos los errores

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cedula');

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once("../models/productoModel.php");
require_once("../models/usuarioModel.php");

$producto = new Producto();
$usuarioModel = new Usuario(); // Instancia del modelo Usuario

// Obtener la cédula desde el encabezado
$cedula = isset($_SERVER['HTTP_CEDULA']) ? $_SERVER['HTTP_CEDULA'] : null;

if (!$cedula || !is_numeric($cedula)) {
    echo json_encode(["error" => "Cédula no válida o no proporcionada en el encabezado."]);
    http_response_code(400);
    exit;
}

// Obtener el usuario correspondiente a la cédula
$usuario = $usuarioModel->obtener_usuario_por_cedula($cedula);

if (!$usuario) {
    echo json_encode(["error" => "Usuario no encontrado para la cédula proporcionada."]);
    http_response_code(401);
    exit;
} else {
    // Depuración: muestra el usuario encontrado
    error_log("Usuario encontrado: " . print_r($usuario, true)); // Loguear el usuario
}

// Solo leer el cuerpo si no es una solicitud GET
$encryptedData = null;
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Para el método DELETE, no necesitamos un cuerpo
    // Solo obtenemos los parámetros de la URL (por ejemplo, id_producto)
    if (isset($_GET["id_producto"])) {
        $id_producto = $_GET["id_producto"];
        // Aquí va tu lógica para eliminar el producto con el id proporcionado
        // Llama a la función para eliminar el producto y devuelve el resultado
        $resultado = $producto->eliminar_producto($id_producto);
        echo json_encode($resultado);
    } else {
        echo json_encode(["error" => "ID del producto no proporcionado en la URL."]);
        http_response_code(400);
    }
    exit;  // Salir después de procesar la solicitud DELETE
} elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    // Para otros métodos, sigue con la lógica de manejar el cuerpo de la solicitud
    $encryptedData = file_get_contents("php://input");

    if (!$encryptedData) {
        echo json_encode(["error" => "Cuerpo de la solicitud vacío."]);
        http_response_code(400);
        exit;
    }

    // Desencriptar el JSON recibido usando la clave del usuario
    $clave = $usuario["contrasena"];
    $decryptedData = desencriptar_json($encryptedData, $clave);

    if ($decryptedData === null) {
        echo json_encode(["error" => "No se pudo desencriptar el mensaje con la clave proporcionada."]);
        http_response_code(401);
        exit;
    }

    // Convertir el JSON desencriptado en un arreglo
    $data = json_decode($decryptedData, true);

    if ($data === null) {
        echo json_encode(["error" => "Error al decodificar el JSON desencriptado."]);
        http_response_code(400);
        exit;
    }
}
// Acciones basadas en el tipo de solicitud
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET["accion"]) && $_GET["accion"] == "contar") {
            $totalProductos = $producto->contar_productos();
            echo json_encode(["total" => $totalProductos]);
        } elseif (isset($_GET["id_producto"])) {
            $id_producto = $_GET["id_producto"];
            $producto_data = $producto->obtener_producto_por_id($id_producto);
            echo json_encode($producto_data ?: ["error" => "Producto no encontrado."]);
        } else {
            $productos = $producto->listar_productos();
            echo json_encode($productos);
        }
        break;

    case 'POST':
        if (isset($data["nombre"]) && isset($data["descripcion"]) && isset($data["precio"])) {
            $resultado = $producto->agregar_producto(
                $data["nombre"],
                $data["descripcion"],
                $data["precio"],
                $data["cantidad"],
                $data["id_categoria"],
                $data["id_proveedor"]
            );
            echo json_encode($resultado);
        } else {
            echo json_encode(["error" => "Faltan datos necesarios para crear el producto."]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if (isset($_GET["id_producto"])) {
            $id_producto = $_GET["id_producto"];
            if (isset($data["nombre"]) && isset($data["descripcion"]) && isset($data["precio"])) {
                $resultado = $producto->actualizar_producto(
                    $id_producto,
                    $data["nombre"],
                    $data["descripcion"],
                    $data["precio"],
                    $data["cantidad"],
                    $data["id_categoria"],
                    $data["id_proveedor"]
                );
                echo json_encode($resultado);
            } else {
                echo json_encode(["error" => "Faltan datos necesarios para actualizar el producto."]);
                http_response_code(400);
            }
        } else {
            echo json_encode(["error" => "ID del producto no proporcionado en la URL."]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        if (isset($_GET["id_producto"])) {
            $id_producto = $_GET["id_producto"];
            $resultado = $producto->eliminar_producto($id_producto);
            echo json_encode($resultado);
        } else {
            echo json_encode(["error" => "ID del producto no proporcionado en la URL."]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode(["error" => "Método no soportado."]);
        http_response_code(405);
        break;
}

/**
 * Función para desencriptar el JSON recibido.
 */
function desencriptar_json($encryptedData, $clave) {
    try {
        $encryptedData = base64_decode($encryptedData);
        if ($encryptedData === false) {
            throw new Exception("Error al decodificar base64.");
        }

        $decryptedData = openssl_decrypt($encryptedData, "aes-256-ecb", $clave, OPENSSL_RAW_DATA);
        if ($decryptedData === false) {
            throw new Exception("Error al desencriptar los datos.");
        }

        return $decryptedData;
    } catch (Exception $e) {
        error_log("Error de desencriptado: " . $e->getMessage());
        return null;
    }

    function encriptar_json($data, $clave)
    {
        try {
            $encryptedData = openssl_encrypt($data, "aes-256-ecb", $clave, OPENSSL_RAW_DATA);
            if ($encryptedData === false) {
                throw new Exception("Error al encriptar los datos.");
            }

            return base64_encode($encryptedData);
        } catch (Exception $e) {
            error_log("Error de encriptado: " . $e->getMessage());
            return null;
        }
    }
}
?>

