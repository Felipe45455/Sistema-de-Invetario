<?php
header("Content-Type: application/json");

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
}
?>
