import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

// Configuración de la Base de Datos
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function findOrCreateUser(email, nombre, apellido, provider) {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE correo = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log(`✅ Registrando nuevo usuario desde ${provider}: ${email}`);

      const rolPorDefecto = "estudiante";
      // Nota: Para usuarios OAuth generamos una contraseña dummy o vacía,
      // pero encriptada por si acaso el sistema requiere hash.
      const passDummy = await bcrypt.hash("OAUTH_USER_PASS", 10);
      const fechaActual = new Date();

      const insertQuery = `
        INSERT INTO users (nombre, apellido, correo, contraseña, rol, fecha_registro)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const nuevo = await pool.query(insertQuery, [
        nombre || "",
        apellido || "",
        email,
        passDummy,
        rolPorDefecto,
        fechaActual,
      ]);

      console.log(`✅ Usuario ${email} creado exitosamente.`);
      return nuevo.rows[0];
    }

    // 3. Usuario ya existente
    const usuario = result.rows[0];
    console.log(
      `✅ Usuario ${usuario.correo} autenticado (Rol: ${usuario.rol})`
    );
    return usuario;
  } catch (error) {
    console.error(`❌ Error verificando usuario en ${provider}:`, error);
    throw error;
  }
}

//GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const correo = profile.emails[0].value;
        const nombre = profile.name?.givenName || "";
        const apellido = profile.name?.familyName || "";

        const usuario = await findOrCreateUser(
          correo,
          nombre,
          apellido,
          "Google"
        );
        return done(null, usuario);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//MICROSOFT
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
        // Microsoft a veces devuelve el mail en lugares distintos
        const correo =
          profile.emails?.[0]?.value ||
          profile._json?.mail ||
          profile._json?.userPrincipalName;

        if (!correo) {
          return done(
            new Error("No se pudo obtener el email de Microsoft"),
            null
          );
        }

        const nombre = profile.name?.givenName || profile.displayName || "";
        const apellido = profile.name?.familyName || "";

        const usuario = await findOrCreateUser(
          correo,
          nombre,
          apellido,
          "Microsoft"
        );
        return done(null, usuario);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Generador de Token reutilizable
const generarTokenYRedirigir = (req, res) => {
  if (!req.user) {
    return res.redirect("/login.html?error=usuario_no_encontrado");
  }
  const token = jwt.sign(req.user, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "2h",
  });
  res.redirect(`/dashboard?token=${token}`);
};

export const googleCallback = generarTokenYRedirigir;
export const microsoftCallback = generarTokenYRedirigir;

// --- REGISTRO MANUAL (Endpoint API) ---
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, rol } = req.body;

    if (!nombre || !apellido || !correo || !contraseña) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await pool.query(
      "SELECT correo FROM users WHERE correo = $1",
      [correo]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const fechaRegistro = new Date();

    try {
      await pool.query(
        `INSERT INTO users (nombre, apellido, correo, contraseña, rol, fecha_registro)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [nombre, apellido, correo, hash, rol || "estudiante", fechaRegistro]
      );
    } catch (sqlErr) {
      console.error("SQL Error on INSERT users:", sqlErr);
      throw sqlErr;
    }

    // Obtener el usuario recién creado para devolverlo con token
    const result = await pool.query(
      "SELECT id_user AS id, nombre, apellido, correo, rol, fecha_registro FROM users WHERE correo = $1 LIMIT 1",
      [correo]
    );
    const usuario = result.rows[0];

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET || "secret_key",
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: usuario,
      token,
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// --- LOGIN MANUAL ---
export const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    if (!correo || !contraseña) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE correo = $1 LIMIT 1",
      [correo]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // No enviar la contraseña en la respuesta
    const safeUser = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const token = jwt.sign(
      { id: safeUser.id, correo: safeUser.correo },
      process.env.JWT_SECRET || "secret_key",
      {
        expiresIn: "2h",
      }
    );

    res.json({ message: "Autenticación exitosa", user: safeUser, token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
