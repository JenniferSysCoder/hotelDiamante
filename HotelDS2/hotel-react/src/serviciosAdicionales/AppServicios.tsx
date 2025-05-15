import { Route, Routes } from "react-router-dom";
import { ListaServicios } from "./components/ListaServicios";
import { NuevoServicio } from "./components/NuevoServicio";
import { EditarServicios } from "./components/EditarServicios";

function AppServicios() {
  return (
    <Routes>
      <Route path="/" element={<ListaServicios />} />
      <Route path="nuevoservicio" element={<NuevoServicio />} />
      <Route path="editarservicio/:id" element={<EditarServicios />} />
    </Routes>
  );
}

export default AppServicios;
