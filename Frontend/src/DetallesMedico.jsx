import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useParams } from "react-router";

export const DetallesMedico = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [medico, setMedico] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerMedico = async () => {
      const response = await fetchAuth(`http://localhost:3000/medicos/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al obtener médico");
      }

      setMedico(data.medico);
      setCargando(false);
    };

    obtenerMedico();
  }, [id, fetchAuth]);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!medico) {
    return <p>Médico no encontrado</p>;
  }

  return (
    <article>
      <h2>Detalles del médico</h2>
      <p>
        <strong>ID:</strong> {medico.id}
      </p>
      <p>
        <strong>Nombre:</strong> {medico.nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {medico.apellido}
      </p>
      <p>
        <strong>Especialidad:</strong> {medico.especialidad}
      </p>
      <p>
        <strong>Matrícula:</strong> {medico.matricula}
      </p>
    </article>
  );
};
