<?php
header("Content-Type: application/json");
// Agregar estas líneas al principio del archivo
header('Access-Control-Allow-Origin: *'); // Permite cualquier origen
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Permite estos métodos
header('Access-Control-Allow-Headers: Content-Type'); // Permite este encabezado

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
}
?>
