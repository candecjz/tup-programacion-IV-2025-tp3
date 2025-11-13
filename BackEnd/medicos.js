import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM medicos");
  res.json({
    success: true,
    medicos: rows,
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
      "SELECT * FROM medicos WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Médico no encontrado" });
    }

    res.json({ success: true, medico: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("especialidad", "Especialidad inválida").isAlpha("es-ES").isLength({ max: 100 }),
  body("matricula", "Matrícula inválida").isLength({ min: 1, max: 50 }).isAlphanumeric(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.body;

    // verificar si la matricula ya existe
    const [medicosExistentes] = await db.execute(
      "SELECT id FROM medicos WHERE matricula=?",
      [matricula]
    );

    if (medicosExistentes.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "La matrícula ya está registrada" });
    }

    const [result] = await db.execute(
      "INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?,?,?,?)",
      [nombre, apellido, especialidad, matricula]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        apellido,
        especialidad,
        matricula,
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
  body("especialidad", "Especialidad inválida").isAlpha("es-ES").isLength({ max: 100 }),
  body("matricula", "Matrícula inválida").isLength({ min: 1, max: 50 }).isAlphanumeric(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, especialidad, matricula } = req.body;

    // verificar que el médico existe
    const [medicosExistentes] = await db.execute(
      "SELECT id FROM medicos WHERE id=?",
      [id]
    );

    if (medicosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Médico no encontrado" });
    }

    const [result] = await db.execute(
      "UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula=? WHERE id=?",
      [nombre, apellido, especialidad, matricula, id]
    );

    res.json({
      success: true,
      data: {
        id,
        nombre,
        apellido,
        especialidad,
        matricula,
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

    // verificar si el médico existe
    const [medicosExistentes] = await db.execute(
      "SELECT id FROM medicos WHERE id=?",
      [id]
    );

    if (medicosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Médico no encontrado" });
    }

    await db.execute("DELETE FROM medicos WHERE id=?", [id]);

    res.json({ success: true, message: "Médico eliminado" });
  }
);

export default router;
