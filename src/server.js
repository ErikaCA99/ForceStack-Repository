import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import passport from "passport";
import session from "express-session";
import http from "http"; 
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = http.createServer(app); // crear servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware base
app.use(express.json());

app.use(express.static("src/views"));
app.use("/css", express.static("src/views/css"));
app.use("/js", express.static("src/views/js"));
app.use("/components", express.static("src/views/components"));

// Sesiones y passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_segura",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Intentar conexión con reintentos
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000;

const connectWithRetry = async (retries = MAX_RETRIES) => {
  while (retries) {
    try {
      await pool.query("SELECT NOW()");
      console.log(" Conectado a PostgreSQL (ForceStackDB)");
      return;
    } catch (err) {
      retries--;
      console.log(
        `⚠️ Reintentando conexión (${MAX_RETRIES - retries}/${MAX_RETRIES})... ${err.message}
      `);
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
    }
  }
  console.error(" No se pudo conectar a PostgreSQL");
  process.exit(1);
};

await connectWithRetry();

// Rutas
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "src/views" });
});

app.get("/dashboard", (req, res) => {
  res.sendFile("pages/dashboard.html", { root: "src/views" });
});

app.get("/topic_uno", (req, res) => {
  res.sendFile("pages/topic_uno.html", { root: "src/views" });
});

//  WEBSOCKETS (Notificaciones)

io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  // enviar mensaje de bienvenida
  socket.emit("notificacion", { mensaje: "Bienvenido al sistema 👋" });

  // escuchar evento del cliente
  socket.on("nuevo_evento", (data) => {
    console.log("📩 Nuevo evento recibido:", data);
    // enviar notificación global
    io.emit("notificacion", { mensaje: "Nueva acción registrada 🚀" });
  });

  // desconexión
  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://127.0.0.1:${PORT}`)
);

export { io }; // opcional: exportar para usar en otros módulos
export default app;