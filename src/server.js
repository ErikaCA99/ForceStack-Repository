import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import passport from "passport";
import session from "express-session"; 
import http from "http"; // ✅ AGREGAR
import { Server } from "socket.io"; // ✅ AGREGAR
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = http.createServer(app); // ✅ AGREGAR
const io = new Server(server, { // ✅ AGREGAR
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(express.static("src/views"));
app.use("/css", express.static("src/views/css"));
app.use("/js", express.static("src/views/js"));
app.use("/components", express.static("src/views/components"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_segura",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const MAX_RETRIES = 10;
const RETRY_DELAY = 3000;

const connectWithRetry = async (retries = MAX_RETRIES) => {
  while (retries) {
    try {
      await pool.query("SELECT NOW()");
      console.log("Conectado a PostgreSQL (ForceStackDB)");
      return;
    } catch (err) {
      retries--;
      console.log(
        `⚠️ Reintentando conexión (${MAX_RETRIES - retries}/${MAX_RETRIES})...${err.message}`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
    }
  }
  console.error("No se pudo conectar a PostgreSQL");
  process.exit(1);
};

await connectWithRetry();

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


io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  
  socket.emit("notificacion", { 
    mensaje: "Bienvenido al sistema 👋",
    tipo: "success"
  });


  socket.on("enviar_notificacion", (data) => {
    console.log("📨 Notificación recibida:", data);
    
   
    io.emit("notificacion", {
      mensaje: data.mensaje,
      tipo: data.tipo || "info"
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});


server.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en http://127.0.0.1:${process.env.PORT}`)
);

export default app;