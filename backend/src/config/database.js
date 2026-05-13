import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('✓ MySQL conectado com sucesso');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Erro ao conectar ao MySQL:', err.message);
    console.error('Verifique as credenciais no arquivo .env');
  });

export default pool;
