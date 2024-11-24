<?php
header("Content-Type: application/json");
// Agregar estas líneas al principio del archivo
header('Access-Control-Allow-Origin: *'); // Permite cualquier origen
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Permite estos métodos
header('Access-Control-Allow-Headers: Content-Type'); // Permite este encabezado

require_once("../models/proveedorModel.php");

$proveedor = new Proveedor();
$data = json_decode(file_get_contents("php://input"), true);

switch ($_GET["accion"]) {
    case "listar":
        $resultado = $proveedor->listar_proveedores();
        echo json_encode($resultado);
        break;
}
?>
