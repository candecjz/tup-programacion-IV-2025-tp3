import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useParams } from "react-router";

export const DetallesPaciente = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPaciente = async () => {
      const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al obtener paciente");
      }

      setPaciente(data.paciente);
      setCargando(false);
    };

    obtenerPaciente();
  }, [id, fetchAuth]);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!paciente) {
    return <p>Paciente no encontrado</p>;
  }

  return (
    <article>
      <h2>Detalles del paciente</h2>
      <p>
        <strong>ID:</strong> {paciente.id}
      </p>
      <p>
        <strong>Nombre:</strong> {paciente.nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {paciente.apellido}
      </p>
      <p>
        <strong>DNI:</strong> {paciente.dni}
      </p>
      <p>
        <strong>Fecha de nacimiento:</strong> {paciente.fecha_nacimiento}
      </p>
      <p>
        <strong>Obra Social:</strong> {paciente.obra_social}
      </p>
    </article>
  );
};
