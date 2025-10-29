import express from "express";
import passport from "passport";
import "../controllers/userControllers.js"; // inicializa la estrategia
import { googleCallback } from "../controllers/userControllers.js";

const router = express.Router();

// Redirección a Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login.html",
    session: false,
  }),
  googleCallback
);

export default router;
