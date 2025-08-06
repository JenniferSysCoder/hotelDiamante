import { Route, Routes } from "react-router-dom";
import { ListaClientes } from "../ListaClientes";
import { NuevoClienteModal } from "../NuevoCliente";
import {EditarClienteModal} from "../EditarCliente";

function AppClientes() {
  return (
    <Routes>
      <Route path="/" element={<ListaClientes />} />
      <Route path="nuevocliente" element={<NuevoClienteModal isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="editarcliente/:id" element={<EditarClienteModal idCliente={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
    </Routes>
  );
}

export default AppClientes;
