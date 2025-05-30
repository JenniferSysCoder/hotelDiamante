import { Routes, Route } from "react-router-dom";
import { ListarReporteReserva } from "./components/ListaReporteReserva";

function AppReportes() {
  return (
    <Routes>
      <Route path="/" element={<ListarReporteReserva />} />
      {}
    </Routes>
  );
}

export default AppReportes;
