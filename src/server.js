import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

// 🔗 Conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL (ForceStackDB) correctamente"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

app.get("/", (req, res) => {
  res.send("🚀 ForceStack API en Node 20.18.0 funcionando!");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
