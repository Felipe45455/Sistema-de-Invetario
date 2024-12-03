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
}

// Clave para encriptar respuestas
$clave = $usuario["contrasena"];

// Leer el cuerpo si no es una solicitud GET
$encryptedData = null;
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    $encryptedData = file_get_contents("php://input");

    if (!$encryptedData) {
        echo json_encode(["error" => "Cuerpo de la solicitud vacío."]);
        http_response_code(400);
        exit;
    }

    // Desencriptar el JSON recibido
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
            responder_encriptado($producto_data ?: ["error" => "Producto no encontrado."], $clave);
        } else {
            $productos = $producto->listar_productos();
            responder_encriptado($productos, $clave);
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
            responder_encriptado($resultado, $clave);
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
                responder_encriptado($resultado, $clave);
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
            responder_encriptado($resultado, $clave);
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
}

/**
 * Función para encriptar los datos antes de responder.
 */
function encriptar_json($data, $clave) {
    try {
        $jsonData = json_encode($data);
        $encryptedData = openssl_encrypt($jsonData, "aes-256-ecb", $clave, OPENSSL_RAW_DATA);
        if ($encryptedData === false) {
            throw new Exception("Error al encriptar los datos.");
        }

        return base64_encode($encryptedData);
    } catch (Exception $e) {
        error_log("Error de encriptado: " . $e->getMessage());
        return null;
    }
}

/**
 * Función para enviar respuestas encriptadas.
 */
function responder_encriptado($data, $clave) {
    $encryptedResponse = encriptar_json($data, $clave);
    if ($encryptedResponse === null) {
        echo json_encode(["error" => "Error al encriptar la respuesta."]);
        http_response_code(500);
    } else {
        echo $encryptedResponse;
    }
}
?>
