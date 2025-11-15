import { useState, useEffect } from "react";
import { useAuth } from "./Auth";

export const CrearTurno = ({ onSuccess }) => {
  const { fetchAuth } = useAuth();
  const [errores, setErrores] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [values, setValues] = useState({
    paciente_id: "",
    medico_id: "",
    fecha: "",
    hora: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const resPacientes = await fetchAuth("http://localhost:3000/pacientes");
      const dataPacientes = await resPacientes.json();
      if (resPacientes.ok) {
        setPacientes(dataPacientes.pacientes);
      }

      const resMedicos = await fetchAuth("http://localhost:3000/medicos");
      const dataMedicos = await resMedicos.json();
      if (resMedicos.ok) {
        setMedicos(dataMedicos.medicos);
      }
    };

    cargarDatos();
  }, [fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/turnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_id: parseInt(values.paciente_id),
        medico_id: parseInt(values.medico_id),
        fecha: values.fecha,
        hora: values.hora,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        return setErrores(data.errores);
      }
      return window.alert("Error al crear turno");
    }
    onSuccess();
  };

  return (
    <article>
      <h3>Crear turno</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Paciente
            <select
              required
              value={values.paciente_id}
              onChange={(e) =>
                setValues({ ...values, paciente_id: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "paciente_id")
              }
            >
              <option value="">Seleccionar paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "paciente_id")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Médico
            <select
              required
              value={values.medico_id}
              onChange={(e) =>
                setValues({ ...values, medico_id: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "medico_id")
              }
            >
              <option value="">Seleccionar médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.apellido} - {m.especialidad}
                </option>
              ))}
            </select>
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "medico_id")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Fecha
            <input
              required
              type="date"
              value={values.fecha}
              onChange={(e) => setValues({ ...values, fecha: e.target.value })}
              aria-invalid={
                errores && errores.some((e) => e.path === "fecha")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "fecha")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Hora
            <input
              required
              type="time"
              value={values.hora}
              onChange={(e) => setValues({ ...values, hora: e.target.value })}
              aria-invalid={
                errores && errores.some((e) => e.path === "hora")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "hora")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
        </fieldset>
        <footer>
          <div className="grid">
            <input type="submit" value="Crear turno" />
          </div>
        </footer>
      </form>
    </article>
  );
};
