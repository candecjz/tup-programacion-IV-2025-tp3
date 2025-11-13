import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import usuariosRouter from "./usuarios.js";
import pacientesRouter from "./pacientes.js";
import medicosRouter from "./medicos.js";
import turnosRouter from "./turnos.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

authConfig();

app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/medicos", medicosRouter);
app.use("/turnos", turnosRouter);

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
