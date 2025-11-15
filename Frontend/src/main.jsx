import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { AuthProvider, AuthPage } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Pacientes } from "./Pacientes.jsx";
import { DetallesPaciente } from "./DetallesPaciente.jsx";
import { ModificarPaciente } from "./ModificarPaciente.jsx";
import { Medicos } from "./Medicos.jsx";
import { DetallesMedico } from "./DetallesMedico.jsx";
import { ModificarMedico } from "./ModificarMedico.jsx";
import { Turnos } from "./Turnos.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <Pacientes />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id"
              element={
                <AuthPage>
                  <DetallesPaciente />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id/modificar"
              element={
                <AuthPage>
                  <ModificarPaciente />
                </AuthPage>
              }
            />
            <Route
              path="medicos"
              element={
                <AuthPage>
                  <Medicos />
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id"
              element={
                <AuthPage>
                  <DetallesMedico />
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarMedico />
                </AuthPage>
              }
            />
            <Route
              path="turnos"
              element={
                <AuthPage>
                  <Turnos />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
