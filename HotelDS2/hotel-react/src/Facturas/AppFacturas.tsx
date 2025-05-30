import { Route, Routes } from "react-router-dom";
import { ListaFacturas } from "./components/ListaFacturas";
import { NuevaFactura } from "./components/NuevaFactura";
import { EditarFactura } from "./components/EditarFactura";
import { VistaFactura } from "./verFactura";

function AppFacturas() {
  return (
    <Routes>
      <Route path="/" element={<ListaFacturas />} />
      <Route path="nuevafactura" element={<NuevaFactura />} />
      <Route path="editarfactura/:id" element={<EditarFactura />} />
      <Route path="verfactura/:id" element={<VistaFactura />} />
    </Routes>
  );
}

export default AppFacturas;
