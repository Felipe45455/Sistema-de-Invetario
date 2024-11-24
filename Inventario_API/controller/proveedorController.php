<?php
header("Content-Type: application/json");
// Habilitar CORS
header('Access-Control-Allow-Origin: *'); // Permite cualquier origen
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Permite métodos HTTP
header('Access-Control-Allow-Headers: Content-Type'); // Permite encabezados específicos

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once("../models/proveedorModel.php");

$proveedor = new Proveedor();
$data = json_decode(file_get_contents("php://input"), true);

switch ($_GET["accion"]) {
    case "listar":
        $resultado = $proveedor->listar_proveedores();
        echo json_encode($resultado);
        break;

    case "detalle":
        $resultado = $proveedor->obtener_proveedor_por_id($data["id_proveedor"]);
        echo json_encode($resultado);
        break;

    case "crear":
        $resultado = $proveedor->agregar_proveedor(
            $data["nombre"],
            $data["telefono"],
            $data["direccion"]
        );
        echo json_encode($resultado);
        break;

    case "actualizar":
        $resultado = $proveedor->actualizar_proveedor(
            $data["id_proveedor"],
            $data["nombre"],
            $data["telefono"],
            $data["direccion"]
        );
        echo json_encode($resultado);
        break;

    case "eliminar":
        $resultado = $proveedor->eliminar_proveedor($data["id_proveedor"]);
        echo json_encode($resultado);
        break;

        case "contar":
            $totalProveedores = $proveedor->contar_proveedores();  // Llamada al modelo para contar productos
            echo json_encode(["total" => $totalProveedores]);  // Devolver un objeto JSON con la clave 'total'
            break;
}
?>
