# 📋 Gestor de Gastos Personales – Proyecto Full Stack

Este proyecto es una aplicación web Full Stack para la administración de gastos personales, donde los usuarios pueden registrar sus ingresos y gastos, consultar su historial y visualizar un resumen de su información financiera.

El sistema está dividido en **Frontend y Backend**, comunicándose a través de una **API RESTful** con autenticación JWT y control de roles (admin/user).

---

## ⚠️ Requisitos antes de ejecutar el proyecto

Antes de iniciar el sistema, es necesario:

- ✅ Tener instalado **Node.js**
- ✅ Tener instalado **MySQL**
- ✅ Crear la **base de datos** y sus tablas
- ✅ Configurar el archivo `.env`
- ✅ Instalar **dependencias** del backend y frontend

Si no se siguen estos pasos, el sistema no funcionará correctamente.

---

## 1️⃣ Crear la base de datos en MySQL

Abrir MySQL y ejecutar los comandos del archivo "schema.sql" la cual se encuentra en la carpeta de "database-model", al igual aqui dejaré el código para más comodidad:

```sql
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
```

---

## 2️⃣ Configurar variables de entorno (.env)

En la carpeta `BackEnd/` crear el archivo `.env`:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=gestor_gastos
JWT_SECRET=AvanceCesar&Rafa
NODE_ENV=development
```

---

## 3️⃣ Instalación de dependencias

### Backend:
```bash
cd BackEnd
npm install
```

### Frontend:
```bash
cd FrontEnd
npm install
```

---

## 4️⃣ Ejecutar el sistema

### Iniciar Backend (Terminal 1):
```bash
cd BackEnd
npm run dev
```
El servidor se conectará a la BD y quedará activo en `http://localhost:5000`

### Iniciar Frontend (Terminal 2):
```bash
cd FrontEnd
npm start
```
La aplicación se abrirá en `http://localhost:3000`

### Ejecutar Tests:
```bash
cd BackEnd
npm test
```

---

## ✨ Funcionalidades

### 🔐 Autenticación y Roles
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión con JWT (7 días de validez)
- ✅ Control de roles: **admin** y **user**
- ✅ Middleware de autenticación en todas las rutas protegidas

### 💰 Gestión de Movimientos
- ✅ Crear ingresos y gastos
- ✅ Editar movimientos (fecha, categoría, monto, descripción)
- ✅ Eliminar movimientos propios
- ✅ Ver historial con paginación (10 por página)
- ✅ Filtrar por **tipo** (ingreso/gasto)
- ✅ Filtrar por **categoría** (búsqueda por texto)

### 📊 Dashboard
- ✅ Resumen financiero: total ingresos, gastos y saldo
- ✅ Gráfico de líneas mostrando saldo acumulado y total

### 👥 Panel Administrativo
- ✅ Ver lista completa de usuarios (solo admins)
- ✅ Eliminar usuarios (solo admins)
- ✅ Se asigna el rol desde la DB.

### 🧪 Testing
- ✅ 12 pruebas automatizadas con Jest

---

## 🔗 Endpoints API

```
POST   /api/autenticacion/login              # Iniciar sesión
POST   /api/autenticacion/registro           # Registrar usuario

GET    /api/movimientos                      # Obtener con paginación y filtros
GET    /api/movimientos/:id                  # Obtener uno específico
POST   /api/movimientos                      # Crear nuevo
PUT    /api/movimientos/:id                  # Editar
DELETE /api/movimientos/:id                  # Eliminar

GET    /api/movimientos/resumen              # Totales financieros
GET    /api/movimientos/estadisticas         # Datos para gráficos

GET    /api/usuarios                         # Ver todos (solo admin)
DELETE /api/usuarios/:id                     # Eliminar usuario (solo admin)
```

---

## 👨‍💻 Autor

- **César Julián Espronceda Pantoja** - Programador FullStack (Frontend y Backend) | AL07040765

---

**v2.0.0** | Terminado el 2 de Marzo del 2026