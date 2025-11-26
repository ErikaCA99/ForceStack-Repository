import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "pg";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Función auxiliar para crear o buscar usuario
async function findOrCreateUser(email, provider) {
  try {
    // Buscar si el correo ya existe
    const result = await pool.query(
      "SELECT correo, rol FROM users WHERE correo = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      // Usuario no encontrado → lo registramos
      console.log(`✅ Registrando nuevo usuario: ${email} (${provider})`);

      const rolPorDefecto = "estudiante";
      const nuevaContrasena = 1234; // el usuario inició con OAuth
      const insertQuery = `
        INSERT INTO users (correo, contrasena, rol)
        VALUES ($1, $2, $3)
        RETURNING correo, rol
      `;
      const nuevo = await pool.query(insertQuery, [
        email,
        nuevaContrasena,
        rolPorDefecto,
      ]);

      console.log(
        `✅ Usuario ${email} creado exitosamente con rol ${rolPorDefecto}`
      );
      return nuevo.rows[0];
    }

    // Usuario ya existente
    const usuario = result.rows[0];
    console.log(
      `✅ Usuario ${usuario.correo} autenticado con rol ${usuario.rol}`
    );
    return usuario;
  } catch (error) {
    console.error("❌ Error verificando o creando el usuario:", error);
    throw error;
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback", // usa localhost si estás en Docker
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const correoGoogle = profile.emails[0].value;
        //const nombreGoogle = profile.displayName;

        // Buscar si el correo ya existe
        const result = await pool.query(
          "SELECT correo, rol FROM users WHERE correo = $1 LIMIT 1",
          [correoGoogle]
        );

        if (result.rows.length === 0) {
          //  Usuario no encontrado → lo registramos
          console.log(` Registrando nuevo usuario: ${correoGoogle}`);

          const rolPorDefecto = "estudiante";
          const nuevaContrasena = 1234; // el usuario inició con Google
          const insertQuery = `
            INSERT INTO users (correo, contrasena, rol)
            VALUES ($1, $2, $3)
            RETURNING correo, rol
          `;
          const nuevo = await pool.query(insertQuery, [
            correoGoogle,
            nuevaContrasena,
            rolPorDefecto,
          ]);

          console.log(
            ` Usuario ${correoGoogle} creado exitosamente con rol ${rolPorDefecto}`
          );
          return done(null, nuevo.rows[0]);
        }

        //  Usuario ya existente
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

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/microsoft/callback",
      scope: ["user.read"],
      tenant: process.env.MICROSOFT_TENANT_ID || "common",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Microsoft devuelve el email en profile.emails o profile._json.mail
        const correoMicrosoft =
          profile.emails?.[0]?.value ||
          profile._json?.mail ||
          profile._json?.userPrincipalName;

        if (!correoMicrosoft) {
          console.error("❌ No se pudo obtener el email de Microsoft");
          return done(
            new Error("Email no disponible en el perfil de Microsoft"),
            null
          );
        }

        const usuario = await findOrCreateUser(correoMicrosoft, "Microsoft");
        return done(null, usuario);
      } catch (error) {
        console.error("❌ Error en autenticación de Microsoft:", error);
        return done(error, null);
      }
    }
  )
);

// Callback de Microsoft (genera token si el usuario existe o fue creado)
export const microsoftCallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/login.html?error=usuario_no_encontrado");
  }

  const token = jwt.sign(req.user, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "2h",
  });

  // Redirige con el token al dashboard
  res.redirect(`/dashboard.html?token=${token}`);
};
