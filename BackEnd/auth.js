import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

router.post(
  "/registro",
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("email", "Email inválido").isEmail(),
  body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    // verificar si el email ya existe
    const [usuariosExistentes] = await db.execute(
      "SELECT id FROM usuarios WHERE email=?",
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El email ya está registrado" });
    }

    // hash de la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, email },
    });
  }
);

router.post(
  "/login",
  body("email", "Email inválido").isEmail(),
  body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    // consultar por un usuario a la bdd
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email o contraseña inválidos" });
    }

    // verificar contraseña
    const hashedPassword = usuarios[0].password_hash;
    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Email o contraseña inválidos" });
    }

    // generar jwt
    const payload = { userId: usuarios[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // devolver jwt y otros datos
    res.json({
      success: true,
      token: token,
      nombre: usuarios[0].nombre,
      email: usuarios[0].email,
    });
  }
);

export default router;
