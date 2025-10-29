import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          nombre: profile.displayName,
          correo: profile.emails[0].value,
          foto: profile.photos[0].value,
        };
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Controlador para generar token JWT y redirigir
export const googleCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign(user, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "2h",
  });

  // Puedes almacenar el token en cookie o query
  res.redirect(`/login.html?token=${token}`);
};
