<?php
require_once("../config/conexion.php");

class Categoria extends Conectar {

    public function listar_categorias() {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT * FROM categorias";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_categoria_por_id($id) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT * FROM categorias WHERE id_categoria = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function agregar_categoria($nombre, $descripcion) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $descripcion);
        $stmt->execute();
        return ["mensaje" => "Categoría agregada exitosamente"];
    }

    public function actualizar_categoria($id, $nombre, $descripcion) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $descripcion);
        $stmt->bindValue(3, $id);
        $stmt->execute();
        return ["mensaje" => "Categoría actualizada correctamente"];
    }

    public function eliminar_categoria($id) {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "DELETE FROM categorias WHERE id_categoria = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return ["mensaje" => "Categoría eliminada exitosamente"];
    }
}
?>
