<?php
header("Content-Type: application/json");
// Agregar estas líneas al principio del archivo
header('Access-Control-Allow-Origin: *'); // Permite cualquier origen
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Permite estos métodos
header('Access-Control-Allow-Headers: Content-Type'); // Permite este encabezado


require_once("../models/productoModel.php");

$producto = new Producto();
$data = json_decode(file_get_contents("php://input"), true);

switch ($_GET["accion"]) {
    case "listar":
        $resultado = $producto->listar_productos();
        echo json_encode($resultado);
        break;

    case "detalle":
        $resultado = $producto->obtener_producto_por_id($data["id_producto"]);
        echo json_encode($resultado);
        break;

    case "crear":
        $resultado = $producto->agregar_producto(
            $data["nombre"],
            $data["descripcion"],
            $data["precio"],
            $data["cantidad"],
            $data["id_categoria"],
            $data["id_proveedor"]
        );
        echo json_encode($resultado);
        break;

    case "actualizar":
        $resultado = $producto->actualizar_producto(
            $data["id_producto"],
            $data["nombre"],
            $data["descripcion"],
            $data["precio"],
            $data["cantidad"],
            $data["id_categoria"],
            $data["id_proveedor"]
        );
        echo json_encode($resultado);
        break;

    case "eliminar":
        $resultado = $producto->eliminar_producto($data["id_producto"]);
        echo json_encode($resultado);
        break;

    case "contar":
        $totalProductos = $producto->contar_productos();  // Llamada al modelo para contar productos
        echo json_encode(["total" => $totalProductos]);  // Devolver un objeto JSON con la clave 'total'
        break;
}
