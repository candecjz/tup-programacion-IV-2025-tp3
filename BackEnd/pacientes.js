import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM pacientes");
  res.json({
    success: true,
    pacientes: rows,
  });
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT * FROM pacientes WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Paciente no encontrado" });
    }

    res.json({ success: true, paciente: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni", "DNI inválido").isLength({ min: 7, max: 8 }).isNumeric(),
  body("fecha_nacimiento", "Fecha de nacimiento inválida").isISO8601(),
  body("obra_social", "Obra social inválida").isLength({ max: 100 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    // verificar si el DNI ya existe
    const [pacientesExistentes] = await db.execute(
      "SELECT id FROM pacientes WHERE dni=?",
      [dni]
    );

    if (pacientesExistentes.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El DNI ya está registrado" });
    }

    const [result] = await db.execute(
      "INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)",
      [nombre, apellido, dni, fecha_nacimiento, obra_social]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        obra_social,
      },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni", "DNI inválido").isLength({ min: 7, max: 8 }).isNumeric(),
  body("fecha_nacimiento", "Fecha de nacimiento inválida").isISO8601(),
  body("obra_social", "Obra social inválida").isLength({ max: 100 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;

    // verificar que el paciente existe
    const [pacientesExistentes] = await db.execute(
      "SELECT id FROM pacientes WHERE id=?",
      [id]
    );

    if (pacientesExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Paciente no encontrado" });
    }

    const [result] = await db.execute(
      "UPDATE pacientes SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, obra_social=? WHERE id=?",
      [nombre, apellido, dni, fecha_nacimiento, obra_social, id]
    );

    res.json({
      success: true,
      data: {
        id,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        obra_social,
      },
    });
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // verificar si el paciente existe
    const [pacientesExistentes] = await db.execute(
      "SELECT id FROM pacientes WHERE id=?",
      [id]
    );

    if (pacientesExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Paciente no encontrado" });
    }

    await db.execute("DELETE FROM pacientes WHERE id=?", [id]);

    res.json({ success: true, message: "Paciente eliminado" });
  }
);

export default router;
