<?php
class Conectar {
    protected $conexion_bd;

    protected function conectar_bd() {
        try {
            $conexion = $this->conexion_bd = new PDO("mysql:host=autorack.proxy.rlwy.net:42658;dbname=inventario", "root", "qsuSOLSCpdVaWZActWqBYOCQyCRlgFlt");
            return $conexion;
        } catch (Exception $e) {
            print "Error en la base de datos: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    public function establecer_codificacion() {
        return $this->conexion_bd->query("SET NAMES 'utf8'");
    }
}
?>
