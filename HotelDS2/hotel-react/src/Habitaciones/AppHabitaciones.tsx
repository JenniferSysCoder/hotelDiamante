import { Route, Routes } from "react-router-dom";
import { ListaHabitacion } from "./components/ListaHabitaciones";
import { NuevaHabitacion } from "./components/NuevaHabitacion";
import { EditarHabitacion } from "./components/EditarHabitacion";

function AppHabitaciones() {
  return (
    <Routes>
      <Route path="/" element={<ListaHabitacion />} />
      <Route path="nuevahabitacion" element={<NuevaHabitacion />} />
      <Route path="editarhabitacion/:id" element={<EditarHabitacion />} />
    </Routes>
  );
}

export default AppHabitaciones;
