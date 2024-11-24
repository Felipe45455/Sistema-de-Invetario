<?php
require_once("../config/conexion.php");

class Proveedor extends Conectar {

    public function listar_proveedores() {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT * FROM proveedores";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_proveedor_por_id($id) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT * FROM proveedores WHERE id_proveedor = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function agregar_proveedor($nombre, $telefono, $direccion) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "INSERT INTO proveedores (id_proveedor,nombre, telefono, direccion) VALUES (NULL,?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $telefono);
        $stmt->bindValue(3, $direccion);
        $stmt->execute();
        return ["mensaje" => "Proveedor agregado exitosamente"];
    }

    public function actualizar_proveedor($id, $nombre, $telefono, $direccion) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "UPDATE proveedores SET nombre = ?, telefono = ?, direccion = ? WHERE id_proveedor = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $telefono);
        $stmt->bindValue(3, $direccion);
        $stmt->bindValue(4, $id);
        $stmt->execute();
        return ["mensaje" => "Proveedor actualizado correctamente"];
    }

    public function eliminar_proveedor($id) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "DELETE FROM proveedores WHERE id_proveedor = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return ["mensaje" => "Proveedor eliminado exitosamente"];
    }

    public function contar_proveedores()
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT COUNT(*) as total FROM proveedores";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['total'];
    }

}
?>
