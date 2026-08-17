const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let connectionPool = null;

async function initializePool() {
  if (!connectionPool) {
    try {
      connectionPool = await mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Ankith@70134',
        database: process.env.DB_NAME || 'pollution_monitoring',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log('✅ Database connection pool created');
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      throw err;
    }
  }
  return connectionPool;
}

// Initialize pool on startup
initializePool().catch(err => {
  console.error('Failed to initialize connection pool:', err);
});

// Export a simple interface that mimics mysql2 connection with promises
module.exports = {
  promise: () => ({
    query: async (sql, values) => {
      const pool = await initializePool();
      return pool.execute(sql, values);
    }
  }),
  
  // Direct query method (no promise wrapper)
  query: async (sql, values) => {
    const pool = await initializePool();
    return pool.execute(sql, values);
  }
};