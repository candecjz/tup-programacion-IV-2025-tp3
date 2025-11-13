import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// lista de todos los usuarios 
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email FROM usuarios");
  res.json({
    success: true,
    usuarios: rows,
  });
});

// obtener un usuario por ID 
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  }
);

// modificar un usuario
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("email", "Email inválido").isEmail(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    // verificar que el usuario exista
    const [usuariosExistentes] = await db.execute(
      "SELECT id FROM usuarios WHERE id=?",
      [id]
    );

    if (usuariosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute(
      "UPDATE usuarios SET nombre=?, email=? WHERE id=?",
      [nombre, email, id]
    );

    res.json({
      success: true,
      data: { id, nombre, email },
    });
  }
);

// eliminar un usuario
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // verificar si el usuario existe
    const [usuariosExistentes] = await db.execute(
      "SELECT id FROM usuarios WHERE id=?",
      [id]
    );

    if (usuariosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute("DELETE FROM usuarios WHERE id=?", [id]);

    res.json({ success: true, message: "Usuario eliminado" });
  }
);

export default router;
