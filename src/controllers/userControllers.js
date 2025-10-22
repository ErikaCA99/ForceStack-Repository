import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuarioDemo = {
      id: 1,
      correo: "admin@forcestack.com",
      contraseñaHash: await bcrypt.hash("123456", 10),
    };

    if (correo !== usuarioDemo.correo)
      return res.status(400).json({ message: "Correo incorrecto" });

    const passwordMatch = await bcrypt.compare(
      contraseña,
      usuarioDemo.contraseñaHash
    );
    if (!passwordMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: usuarioDemo.id, correo: usuarioDemo.correo },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: { id: usuarioDemo.id, correo: usuarioDemo.correo },
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};
