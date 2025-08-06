import { Route, Routes } from "react-router-dom";
import { ListaLimpieza } from "../ListaLimpiezas";
import { NuevaLimpiezaModal } from "../NuevaLimpieza";
import { EditarLimpiezaModal } from "../EditarLimpieza";

function AppLimpiezas() {
  return (
    <Routes>
      <Route path="/" element={<ListaLimpieza />} />
      <Route path="nuevalimpieza" element={<NuevaLimpiezaModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarlimpieza/:id" element={<EditarLimpiezaModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } idLimpieza={0} />} />
    </Routes>
  );
}

export default AppLimpiezas;
