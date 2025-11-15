import { useEffect, useState, useCallback } from "react";
import { AuthPage, useAuth } from "./Auth";
import { Link } from "react-router";
import { CrearPaciente } from "./CrearPaciente";

export function Pacientes() {
  const { fetchAuth } = useAuth();

  const [pacientes, setPacientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchPacientes = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();

      if (buscar) {
        searchParams.append("buscar", buscar);
      }

      const response = await fetchAuth(
        "http://localhost:3000/pacientes" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setPacientes(data.pacientes);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el paciente?")) {
      const response = await fetchAuth(
        `http://localhost:3000/pacientes/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al quitar paciente");
      }

      await fetchPacientes();
    }
  };

  return (
    <AuthPage>
      <article>
        <h2>Pacientes</h2>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cancelar" : "Nuevo paciente"}
        </button>
        {mostrarFormulario && (
          <CrearPaciente
            onSuccess={() => {
              setMostrarFormulario(false);
              fetchPacientes();
            }}
          />
        )}
        <div className="grid">
          <input
            placeholder="Buscar por DNI"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
          <button onClick={() => fetchPacientes(buscar)}>Buscar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Fecha Nacimiento</th>
              <th>Obra Social</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.dni}</td>
                <td>{p.fecha_nacimiento}</td>
                <td>{p.obra_social}</td>
                <td>
                  <Link role="button" to={`/pacientes/${p.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/pacientes/${p.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleQuitar(p.id)}>Quitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </AuthPage>
  );
}
