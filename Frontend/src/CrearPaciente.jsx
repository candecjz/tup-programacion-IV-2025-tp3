import { useState } from "react";
import { useAuth } from "./Auth";

export const CrearPaciente = ({ onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    obra_social: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        return setErrores(data.errores);
      }
      return window.alert("Error al crear paciente");
    }
    onSuccess();
  };

  return (
    <article>
      <h3>Crear paciente</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) =>
                setValues({ ...values, nombre: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "nombre")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "nombre")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) =>
                setValues({ ...values, apellido: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "apellido")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "apellido")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            DNI
            <input
              required
              value={values.dni}
              onChange={(e) => setValues({ ...values, dni: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "dni")}
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "dni")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Fecha de nacimiento
            <input
              required
              type="date"
              value={values.fecha_nacimiento}
              onChange={(e) =>
                setValues({ ...values, fecha_nacimiento: e.target.value })
              }
              aria-invalid={
                errores &&
                errores.some((e) => e.path === "fecha_nacimiento")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "fecha_nacimiento")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Obra Social
            <input
              required
              value={values.obra_social}
              onChange={(e) =>
                setValues({ ...values, obra_social: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "obra_social")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "obra_social")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
        </fieldset>
        <footer>
          <div className="grid">
            <input type="submit" value="Crear paciente" />
          </div>
        </footer>
      </form>
    </article>
  );
};
