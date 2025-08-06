import { Route, Routes } from "react-router-dom";
import { ListaHabitacion } from "../ListaHabitaciones";
import { NuevaHabitacionModal } from "../NuevaHabitacion";
import { EditarHabitacionModal } from "../EditarHabitacion";

function AppHabitaciones() {
  return (
    <Routes>
      <Route path="/" element={<ListaHabitacion />} />
      <Route path="nuevahabitacion" element={<NuevaHabitacionModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarhabitacion/:id" element={<EditarHabitacionModal idHabitacion={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
    </Routes>
  );
}

export default AppHabitaciones;
