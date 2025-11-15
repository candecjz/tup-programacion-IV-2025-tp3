import { useState } from "react";
import { useAuth } from "./Auth";

export const Registro = () => {
  const { error, registro } = useAuth();

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registro(nombre, email, password);
    if (result.success) {
      setOpen(false);
      setNombre("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Registrarse</button>
      <dialog open={open}>
        <article>
          <h2>Crear nueva cuenta</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="nombre">Nombre:</label>
              <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <label htmlFor="email">Email:</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password">Contraseña:</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <mark>{error}</mark>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Registrarse" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};
