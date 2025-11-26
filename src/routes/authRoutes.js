import express from "express";
import passport from "passport";
import "../controllers/userControllers.js"; // inicializa la estrategia
import { googleCallback } from "../controllers/userControllers.js";
import { microsoftCallback } from "../controllers/userControllers.js";

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

// Redirección a Microsoft
router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    scope: ["user.read"],
  })
);

// Callback de Microsoft
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: "/login.html?error=microsoft_auth_failed",
    session: false,
  }),
  microsoftCallback
);

export default router;
