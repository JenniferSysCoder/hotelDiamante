import { Route, Routes } from "react-router-dom";
import { ListaPagos } from "../ListaPagos";
import { NuevoPagoModal } from "../NuevoPago";
import { EditarPagoModal } from "../EditarPago";

function AppPagos() {
  return (
    <Routes>
      <Route path="/" element={<ListaPagos />} />
      <Route path="nuevopago" element={<NuevoPagoModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarpago/:id" element={<EditarPagoModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } onSave={function (): void {
        throw new Error("Function not implemented.");
      } } idPago={0} />} />
    </Routes>
  );
}

export default AppPagos;
