import dotenv from "dotenv";
import pkg from "pg";
import app from "./app.js";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en http://127.0.0.1:${process.env.PORT}`)
);
