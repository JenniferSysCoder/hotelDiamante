import { Route, Routes } from "react-router-dom";
import { ListaLimpieza } from "./components/ListaLimpiezas";
import { NuevaLimpieza } from "./components/NuevaLimpieza";
import { EditarLimpieza } from "./components/EditarLimpieza";

function AppLimpiezas() {
  return (
    <Routes>
      <Route path="/" element={<ListaLimpieza />} />
      <Route path="nuevalimpieza" element={<NuevaLimpieza />} />
      <Route path="editarlimpieza/:id" element={<EditarLimpieza />} />
    </Routes>
  );
}

export default AppLimpiezas;
