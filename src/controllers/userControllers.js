import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const correoGoogle = profile.emails[0].value;
        const nombreGoogle = profile.name?.givenName || "";
        const apellidoGoogle = profile.name?.familyName || "";

        // Buscar si el correo ya existe
        const result = await pool.query(
          "SELECT id, correo, rol FROM users WHERE correo = $1 LIMIT 1",
          [correoGoogle]
        );

        if (result.rows.length === 0) {
          //  Usuario no encontrado lo registramos
          console.log(` Registrando nuevo usuario: ${correoGoogle}`);

          const rolPorDefecto = "estudiante";
          const nuevaContrasena = "1234";
          const fechaActual = new Date();

          const insertQuery = `
            INSERT INTO users (nombre, apellido, correo, contraseña, rol, fecha_creacion)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, correo, rol
          `;

          const nuevo = await pool.query(insertQuery, [
            nombreGoogle,
            apellidoGoogle,
            correoGoogle,
            nuevaContrasena,
            rolPorDefecto,
            fechaActual,
          ]);

          console.log(
            ` Usuario ${correoGoogle} creado exitosamente con rol ${rolPorDefecto}`
          );

          return done(null, nuevo.rows[0]);
        }

        // Usuario ya existente
        const usuario = result.rows[0];
        console.log(
          ` Usuario ${usuario.correo} autenticado con rol ${usuario.rol}`
        );
        return done(null, usuario);
      } catch (error) {
        console.error(" Error verificando o creando el usuario:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Callback de Google (genera token si el usuario existe o fue creado)
export const googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/login.html?error=usuario_no_encontrado");
  }

  const token = jwt.sign(req.user, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "2h",
  });

  // Redirige con el token al dashboard
  res.redirect(`/dashboard.html?token=${token}`);
};
