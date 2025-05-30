import { Route, Routes } from "react-router-dom";
import { ListaUsuarios } from "./components/ListaUsuarios";
import { NuevoUsuario } from "./components/NuevoUsuario";
import { EditarUsuario } from "./components/EditarUsuario";

function AppUsuario() {
  return (
    <Routes>
      <Route path="/" element={<ListaUsuarios />} />
      <Route path="nuevousuario" element={<NuevoUsuario />} />
      <Route path="editarusuario/:id" element={<EditarUsuario />} />
    </Routes>
  );
}

export default AppUsuario;
