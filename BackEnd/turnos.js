import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(
    "SELECT t.id, t.paciente_id, t.medico_id, t.fecha, t.hora, t.estado, t.observaciones, p.nombre as paciente_nombre, p.apellido as paciente_apellido, m.nombre as medico_nombre, m.apellido as medico_apellido FROM turnos t JOIN pacientes p ON t.paciente_id = p.id JOIN medicos m ON t.medico_id = m.id"
  );
  res.json({
    success: true,
    turnos: rows,
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
      "SELECT t.id, t.paciente_id, t.medico_id, t.fecha, t.hora, t.estado, t.observaciones, p.nombre as paciente_nombre, p.apellido as paciente_apellido, m.nombre as medico_nombre, m.apellido as medico_apellido FROM turnos t JOIN pacientes p ON t.paciente_id = p.id JOIN medicos m ON t.medico_id = m.id WHERE t.id=?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Turno no encontrado" });
    }

    res.json({ success: true, turno: rows[0] });
  }
);

router.post(
  "/",
  verificarAutenticacion,
  body("paciente_id", "Paciente inválido").isInt({ min: 1 }),
  body("medico_id", "Médico inválido").isInt({ min: 1 }),
  body("fecha", "Fecha inválida").isISO8601(),
  body("hora", "Hora inválida").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  verificarValidaciones,
  async (req, res) => {
    const { paciente_id, medico_id, fecha, hora } = req.body;

    // verificar que el paciente exista
    const [pacientes] = await db.execute(
      "SELECT id FROM pacientes WHERE id=?",
      [paciente_id]
    );

    if (pacientes.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Paciente no encontrado" });
    }

    // verificar que el médico exista
    const [medicos] = await db.execute(
      "SELECT id FROM medicos WHERE id=?",
      [medico_id]
    );

    if (medicos.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Médico no encontrado" });
    }

    const [result] = await db.execute(
      "INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)",
      [paciente_id, medico_id, fecha, hora, "pendiente", ""]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        paciente_id,
        medico_id,
        fecha,
        hora,
        estado: "pendiente",
        observaciones: "",
      },
    });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("estado", "Estado inválido").isIn([
    "pendiente",
    "atendido",
    "cancelado",
  ]),
  body("observaciones", "Observaciones inválidas")
    .optional()
    .isLength({ max: 500 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { estado, observaciones } = req.body;

    // verificar que el turno exista
    const [turnosExistentes] = await db.execute(
      "SELECT id FROM turnos WHERE id=?",
      [id]
    );

    if (turnosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Turno no encontrado" });
    }

    const [result] = await db.execute(
      "UPDATE turnos SET estado=?, observaciones=? WHERE id=?",
      [estado, observaciones || "", id]
    );

    res.json({
      success: true,
      data: {
        id,
        estado,
        observaciones: observaciones || "",
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

    // verificar si el turno existe
    const [turnosExistentes] = await db.execute(
      "SELECT id FROM turnos WHERE id=?",
      [id]
    );

    if (turnosExistentes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Turno no encontrado" });
    }

    await db.execute("DELETE FROM turnos WHERE id=?", [id]);

    res.json({ success: true, message: "Turno eliminado" });
  }
);

export default router;
