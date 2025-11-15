import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Ingresar } from "./Ingresar";
import { Registro } from "./Registro";

export const Layout = () => {
  const { isAuthenticated, logout, nombre } = useAuth();

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pacientes">Pacientes</Link>
          </li>
          <li>
            <Link to="/medicos">Médicos</Link>
          </li>
          <li>
            <Link to="/turnos">Turnos</Link>
          </li>
        </ul>
        <ul>
          <li>
            {isAuthenticated ? (
              <>
                <span>{nombre}</span>
                <button onClick={() => logout()}>Salir</button>
              </>
            ) : (
              <>
                <Ingresar />
                <Registro />
              </>
            )}
          </li>
        </ul>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};
