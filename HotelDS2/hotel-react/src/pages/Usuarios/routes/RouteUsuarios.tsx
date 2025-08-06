import { Route, Routes } from "react-router-dom";
import { ListaUsuarios } from "../ListaUsuarios";
import { NuevoUsuarioModal } from "../NuevoUsuario";
import { EditarUsuarioModal } from "../EditarUsuario";

function AppUsuario() {
  return (
    <Routes>
      <Route path="/" element={<ListaUsuarios />} />
      <Route path="nuevousuario" element={<NuevoUsuarioModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarusuario/:id" element={<EditarUsuarioModal isOpen={false} idUsuario={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
    </Routes>
  );
}

export default AppUsuario;
