import { Route, Routes } from "react-router-dom";
import { ListaServicios } from "../ListaServicios";
import { NuevoServicioModal } from "../NuevoServicio";
import { EditarServicioModal } from "../EditarServicios";

function AppServicios() {
  return (
    <Routes>
      <Route path="/" element={<ListaServicios />} />
      <Route path="nuevoservicio" element={<NuevoServicioModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarservicio/:id" element={<EditarServicioModal idServicio={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } isOpen={false} />} />
    </Routes>
  );
}

export default AppServicios;
