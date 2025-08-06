import { Route, Routes } from "react-router-dom";
import { ListaRoles } from "../ListaRoles";
import { NuevoRolModal } from "../NuevoRol";
import { EditarRolModal } from "../EditarRol";

function AppRoles() {
  return (
    <Routes>
      <Route path="/" element={<ListaRoles />} />
      <Route
        path="nuevorol"
        element={
          <NuevoRolModal
            isOpen={false}
            onClose={() => {
              throw new Error("Function not implemented.");
            }}
            onSave={() => {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />
      <Route
        path="editarrol/:id"
        element={
          <EditarRolModal
            idRol={0}
            isOpen={false}
            onClose={() => {
              throw new Error("Function not implemented.");
            }}
            onSave={() => {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />
    </Routes>
  );
}

export default AppRoles;
