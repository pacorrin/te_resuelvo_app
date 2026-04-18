require("dotenv").config();
const mysql = require("mysql2/promise");

async function testConnection() {
  console.log("Testing connection with:");
  console.log("Host:", process.env.DB_HOST);
  console.log("Port:", process.env.DB_PORT);
  console.log("User:", process.env.DB_USERNAME);
  console.log("Database:", process.env.DB_DATABASE);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectTimeout: 5000, // 5 seconds timeout
    });
    console.log("Successfully connected to the database!");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
