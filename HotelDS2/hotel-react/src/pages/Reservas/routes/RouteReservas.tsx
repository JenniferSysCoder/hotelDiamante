import { Route, Routes } from "react-router-dom";
import { ListaReserva } from "../ListaReservas";
import { NuevaReservaModal } from "../NuevaReserva";
import { EditarReservaModal } from "../EditarReserva";

function AppReservas() {
  return (
    <Routes>
      <Route path="/" element={<ListaReserva />} />
      <Route path="nuevareserva" element={<NuevaReservaModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarreserva/:id" element={<EditarReservaModal isOpen={false} idReserva={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
    </Routes>
  );
}

export default AppReservas;
