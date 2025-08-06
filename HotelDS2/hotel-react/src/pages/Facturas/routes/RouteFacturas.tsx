import { Route, Routes } from "react-router-dom";
import { ListaFacturas } from "../ListaFacturas";
import { NuevaFacturaModal } from "../NuevaFactura";
import { EditarFacturaModal } from "../EditarFactura";
import { VistaFactura } from "../verFactura";

function AppFacturas() {
  return (
    <Routes>
      <Route path="/" element={<ListaFacturas />} />
      <Route path="nuevafactura" element={<NuevaFacturaModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarfactura/:id" element={<EditarFacturaModal idFactura={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="verfactura/:id" element={<VistaFactura />} />
    </Routes>
  );
}

export default AppFacturas;
