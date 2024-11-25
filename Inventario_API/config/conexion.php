<?php
class Conectar {
    protected $conexion_bd;

    protected function conectar_bd() {
        try {
            $conexion = $this->conexion_bd = new PDO("mysql:host=sql206.infinityfree.com:3306;dbname=if0_37779892_inventario", "if0_37779892", "k2Sc66vORgy3");
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
