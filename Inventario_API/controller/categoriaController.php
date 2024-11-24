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

require_once("../models/categoriaModel.php");


$categoria = new Categoria();
$data = json_decode(file_get_contents("php://input"), true);

switch ($_GET["accion"]) {
    case "listar":
        $resultado = $categoria->listar_categorias();
        echo json_encode($resultado);
        break;

    case "detalle":
        $resultado = $categoria->obtener_categoria_por_id($data["id_categoria"]);
        echo json_encode($resultado);
        break;

    case "crear":
        error_log(json_encode($data));
        $resultado = $categoria->agregar_categoria( 
            $data["nombre"],
            $data["descripcion"]
        );
        echo json_encode($resultado);
        break;

    case "actualizar":
        $resultado = $categoria->actualizar_categoria(
            $data["id_categoria"],
            $data["nombre"],
            $data["descripcion"]
        );
        echo json_encode($resultado);
        break;

    case "eliminar":
        $resultado = $categoria->eliminar_categoria($data["id_categoria"]);
        echo json_encode($resultado);
        break;
    
        case "contar":
            $totalCategorias = $categoria->contar_categorias();  // Llamada al modelo para contar productos
            echo json_encode(["total" => $totalCategorias]);  // Devolver un objeto JSON con la clave 'total'
            break;

}
?>
