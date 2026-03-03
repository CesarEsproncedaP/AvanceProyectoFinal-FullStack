-- Crear la base de datos
CREATE DATABASE gestor_gastos;

USE gastor_gastos;

-- Crear tablas
CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
	correo VARCHAR(175) UNIQUE NOT NULL,
	contrasena VARCHAR(255) NOT NULL,
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('ingreso', 'gasto') NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  descripcion VARCHAR(255),
  fecha DATE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


-- Modificar tabla usuarios para añadir los roles.
ALTER TABLE usuarios
ADD COLUMN rol ENUM('admin','user') NOT NULL DEFAULT 'user' AFTER contrasena;

-- Ver la estructura de las tablas
SELECT * FROM usuarios;

SELECT * FROM movimientos;