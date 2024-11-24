<?php
require_once("../config/conexion.php");

class Producto extends Conectar
{

    public function listar_productos()
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.cantidad, p.id_categoria, p.id_proveedor, 
                       c.nombre AS categoria, pr.nombre AS proveedor
                FROM productos p
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener_producto_por_id($id)
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT * FROM productos WHERE id_producto = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function agregar_producto($nombre, $descripcion, $precio, $cantidad, $id_categoria, $id_proveedor)
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "INSERT INTO productos (id_producto,nombre, descripcion, precio, cantidad, id_categoria, id_proveedor) 
                VALUES (NULL,?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $descripcion);
        $stmt->bindValue(3, $precio);
        $stmt->bindValue(4, $cantidad);
        $stmt->bindValue(5, $id_categoria);
        $stmt->bindValue(6, $id_proveedor);
        $stmt->execute();
        return ["mensaje" => "Producto agregado exitosamente"];
    }

    public function actualizar_producto($id, $nombre, $descripcion, $precio, $cantidad, $id_categoria, $id_proveedor)
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, 
                id_categoria = ?, id_proveedor = ? WHERE id_producto = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $descripcion);
        $stmt->bindValue(3, $precio);
        $stmt->bindValue(4, $cantidad);
        $stmt->bindValue(5, $id_categoria);
        $stmt->bindValue(6, $id_proveedor);
        $stmt->bindValue(7, $id);
        $stmt->execute();
        return ["mensaje" => "Producto actualizado correctamente"];
    }

    public function eliminar_producto($id)
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "DELETE FROM productos WHERE id_producto = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bindValue(1, $id);
        $stmt->execute();
        return ["mensaje" => "Producto eliminado exitosamente"];
    }

    public function contar_productos()
    {
        $conexion = parent::conectar_bd();
        parent::establecer_codificacion();

        $sql = "SELECT COUNT(*) as total FROM productos";
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado['total'];
    }
}
