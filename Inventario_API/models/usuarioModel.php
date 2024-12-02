<?php
require_once("../config/conexion.php"); // Conexión a la base de datos

class Usuario extends Conectar {

    public function __construct() {
        // Llamamos al método conectar_bd() desde la clase base (Conectar)
        $this->conectar_bd();
        $this->establecer_codificacion(); // Establecer la codificación de caracteres
    }

    /**
     * Obtener un usuario por su cédula.
     * @param string $cedula
     * @return array|null
     */
    public function obtener_usuario_por_cedula($cedula) {
        // Consulta SQL para obtener el usuario por la cédula
        $sql = "SELECT cedula, nombre, contrasena FROM usuarios WHERE cedula = :cedula LIMIT 1";
        $stmt = $this->conexion_bd->prepare($sql); // Usamos la propiedad heredada para la conexión
        $stmt->bindParam(':cedula', $cedula, PDO::PARAM_STR);
        $stmt->execute();
        
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verifica si el usuario fue encontrado
        if ($usuario) {
            return $usuario;
        }
        
        return null; // Si no se encuentra el usuario, retorna null
    }
}
?>
