const mysql = require('mysql2');
require('dotenv').config();

// Se creó un pool para manejar varias conexiones a la base de datos.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertimos el pool en promesas para poder usar async y await.
const poolPromesas = pool.promise();

// Probamos que si funcione la conexión.
pool.getConnection((error, conexion) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    return;
  }
  console.log('Conexión exitosa a MySQL');
  conexion.release();
});

module.exports = poolPromesas;