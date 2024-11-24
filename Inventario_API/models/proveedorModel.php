<?php
require_once("../config/conexion.php");

class Proveedor extends Conectar {
    
    public function listar_proveedores() {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT id_proveedor, nombre, telefono, direccion FROM proveedores";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
