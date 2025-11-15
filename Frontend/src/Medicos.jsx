import { useEffect, useState, useCallback } from "react";
import { AuthPage, useAuth } from "./Auth";
import { Link } from "react-router";
import { CrearMedico } from "./CrearMedico";

export function Medicos() {
  const { fetchAuth } = useAuth();

  const [medicos, setMedicos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchMedicos = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();

      if (buscar) {
        searchParams.append("buscar", buscar);
      }

      const response = await fetchAuth(
        "http://localhost:3000/medicos" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setMedicos(data.medicos);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchMedicos();
  }, [fetchMedicos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el médico?")) {
      const response = await fetchAuth(
        `http://localhost:3000/medicos/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al quitar médico");
      }

      await fetchMedicos();
    }
  };

  return (
    <AuthPage>
      <article>
        <h2>Médicos</h2>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cancelar" : "Nuevo médico"}
        </button>
        {mostrarFormulario && (
          <CrearMedico
            onSuccess={() => {
              setMostrarFormulario(false);
              fetchMedicos();
            }}
          />
        )}
        <div className="grid">
          <input
            placeholder="Buscar por especialidad"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
          <button onClick={() => fetchMedicos(buscar)}>Buscar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.apellido}</td>
                <td>{m.especialidad}</td>
                <td>{m.matricula}</td>
                <td>
                  <Link role="button" to={`/medicos/${m.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/medicos/${m.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleQuitar(m.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </AuthPage>
  );
}
