# 📋 Gestor de Gastos Personales – Proyecto Full Stack

Este proyecto es una aplicación web Full Stack para la administración de gastos personales, donde los usuarios pueden registrar sus ingresos y gastos, consultar su historial y visualizar un resumen de su información.

El sistema está dividido en frontend y backend, comunicándose a través de una API.

El programa todavia tiene mejoras las cuales se tienen pensado hacer en el Proyecto Final.

---

## ⚠️ Requisitos antes de ejecutar el proyecto

Antes de iniciar el sistema, es necesario:

- Tener instalado Node.js  
- Tener instalado MySQL  
- Crear la base de datos  
- Configurar el archivo `.env`  
- Instalar dependencias del backend  

Si no se siguen estos pasos, el sistema no funcionará correctamente.

---

## 1. Crear la base de datos en MySQL

Abrir MySQL y ejecutar los siguientes comandos:

```sql
CREATE DATABASE gestor_gastos;

USE gestor_gastos;

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

SELECT * FROM usuarios;

SELECT * FROM movimientos;
```
## Configurar variables de entorno (.env)

En la carpeta BackEnd se debe crear el archivo:
```
.env
```
Y agregar lo siguiente:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU CONTRASEÑA
DB_NAME=gestor_gastos
JWT_SECRET=AvanceCesar&Rafa
```
## 3. Instalar dependencias del Backend
Desde la carpeta principal del proyecto:
```
cd BackEnd
npm install express mysql2 jsonwebtoken bcryptjs cors dotenv
```
Instalar nodemon como dependencia de desarrollo:
```
npm install --save-dev nodemon
```

## 4. Ejecutar el sistema e Iniciar Backend
En la terminal:
```
cd BackEnd
node server.js
```
El servidor se conectará a la base de datos y quedará activo.

## Estructura del proyecto
```
AVANCEPROYECTOFINAL/
│
├ BackEnd/
│   ├ config/
│   │   └ db.js
│   ├ controllers/
│   │   ├ authController.js
│   │   └ transactionController.js
│   ├ middleware/
│   │   ├ auth.js
│   │   └ errorHandler.js
│   ├ routes/
│   │   ├ auth.js
│   │   └ transactions.js
│   ├ node_modules/
│   ├ .env
│   ├ .gitignore
│   ├ package.json
│   ├ package-lock.json
│   └ server.js
│
├ FrontEnd/
│   ├ css/
│   │   └ styles.css
│   ├ js/
│   │   ├ dashboard.js
│   │   ├ login.js
│   │   └ registro.js
│   ├ index.html
│   ├ login.html
│   ├ registro.html
│   └ dashboard.html
│
└ README.md
```
## Funcionalidades
El sistema permite:

  - Registro de usuarios

  - Inicio de sesión

  - Autenticación con token

  - Registro de ingresos

  - Registro de gastos

  - Edición de información

  - Eliminación de movimientos

## Posibles mejoras del proyecto
En futuras versiones, el sistema puede mejorarse con:

  - Hacer que funcione lo de buscar un movimiento por tipos (No pudimos hacerlo funcionar y no nos rompimos     la cabeza debido a que es un avance)

  - Implementar gráficas para visualizar gastos

  - Mejorar diseño responsivo para celulares

  - Implementar que cada inicio de mes el resumen Financiero se reinicie pero que los datos se queden           guardados en la DB

## Creadores
  - César Julián Espronceda Pantoja (Desarrollador BackEnd) | Matrícula: AL07040765
  - Rafael Cárdenas de la Peña (Desarrollador FrontEnd) | Matrícula: AL07065861


