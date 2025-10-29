import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 segundos

// 🔁 Función para reconectar si la base aún no está lista
const connectWithRetry = async (retries = MAX_RETRIES) => {
  while (retries) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Conectado a PostgreSQL (ForceStackDB) correctamente");
      return;
    } catch (err) {
      retries -= 1;
      console.log(
        `⚠️ No se pudo conectar a PostgreSQL. Reintentando en ${RETRY_DELAY / 1000}s... (${MAX_RETRIES - retries}/${MAX_RETRIES})`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
    }
  }
  console.error("❌ No se pudo conectar a PostgreSQL después de varios intentos. Cerrando servidor...");
  process.exit(1);
};

await connectWithRetry();

app.get("/", (req, res) => {
  res.send("🚀 ForceStack API en Node 20.18.0 funcionando!");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

export default app;