import { Route, Routes } from "react-router-dom";
import { ListaReserva } from "./components/ListaReservas";
import { NuevaReserva } from "./components/NuevaReserva";
import { EditarReserva } from "./components/EditarReserva";

function AppReservas() {
  return (
    <Routes>
      <Route path="/" element={<ListaReserva />} />
      <Route path="nuevareserva" element={<NuevaReserva />} />
      <Route path="editarreserva/:id" element={<EditarReserva />} />
    </Routes>
  );
}

export default AppReservas;
