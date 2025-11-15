import { useEffect, useState, useCallback } from "react";
import { AuthPage, useAuth } from "./Auth";
import { CrearTurno } from "./CrearTurno";

export function Turnos() {
  const { fetchAuth } = useAuth();

  const [turnos, setTurnos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [estadoTemporal, setEstadoTemporal] = useState("");
  const [observacionTemporal, setObservacionTemporal] = useState("");

  const fetchTurnos = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/turnos");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.error);
      return;
    }

    setTurnos(data.turnos);
  }, [fetchAuth]);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el turno?")) {
      const response = await fetchAuth(
        `http://localhost:3000/turnos/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al quitar turno");
      }

      await fetchTurnos();
    }
  };

  const handleAgregarObservacion = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    setTurnoSeleccionado(turno);
    setEstadoTemporal(turno.estado);
    setObservacionTemporal(turno.observaciones || "");
    setDialogoAbierto(true);
  };

  const handleGuardarObservacion = async (e) => {
    e.preventDefault();
    
    const response = await fetchAuth(`http://localhost:3000/turnos/${turnoSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: estadoTemporal,
        observaciones: observacionTemporal,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al actualizar turno");
    }

    setDialogoAbierto(false);
    setTurnoSeleccionado(null);
    setEstadoTemporal("");
    setObservacionTemporal("");
    await fetchTurnos();
  };

  const handleCerrarDialogo = () => {
    setDialogoAbierto(false);
    setTurnoSeleccionado(null);
    setEstadoTemporal("");
    setObservacionTemporal("");
  };

  return (
    <AuthPage>
      <article>
        <h2>Turnos</h2>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cancelar" : "Nuevo turno"}
        </button>
        {mostrarFormulario && (
          <CrearTurno
            onSuccess={() => {
              setMostrarFormulario(false);
              fetchTurnos();
            }}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  {t.paciente_nombre} {t.paciente_apellido}
                </td>
                <td>
                  {t.medico_nombre} {t.medico_apellido}
                </td>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>
                  <strong>Estado:</strong> {t.estado}
                  <br />
                  <strong>Observaciones:</strong> {t.observaciones || "-"}
                </td>
                <td>
                  <button onClick={() => handleAgregarObservacion(t.id)}>
                    Observaciones
                  </button>
                  <button onClick={() => handleQuitar(t.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <dialog open={dialogoAbierto}>
        <article>
          <h2>Editar turno</h2>
          <form onSubmit={handleGuardarObservacion}>
            <fieldset>
              <label>
                Estado
                <select
                  value={estadoTemporal}
                  onChange={(e) => setEstadoTemporal(e.target.value)}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="atendido">Atendido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </label>
              <label>
                Observaciones
                <textarea
                  value={observacionTemporal}
                  onChange={(e) => setObservacionTemporal(e.target.value)}
                  rows="4"
                  placeholder="Ingrese observaciones"
                />
              </label>
            </fieldset>
            <footer>
              <div className="grid">
                <button
                  type="button"
                  className="secondary"
                  onClick={handleCerrarDialogo}
                >
                  Cancelar
                </button>
                <button type="submit">Guardar</button>
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </AuthPage>
  );
}
