import { Route, Routes } from "react-router-dom";
import { ListaPagos } from "./components/ListaPagos";
import { NuevoPago } from "./components/NuevoPago";
import { EditarPago } from "./components/EditarPago";

function AppPagos() {
  return (
    <Routes>
      <Route path="/" element={<ListaPagos />} />
      <Route path="nuevopago" element={<NuevoPago />} />
      <Route path="editarpago/:id" element={<EditarPago />} />
    </Routes>
  );
}

export default AppPagos;
