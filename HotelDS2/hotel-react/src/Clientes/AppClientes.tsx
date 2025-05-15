import { Route, Routes } from "react-router-dom";
import { ListaClientes } from "./components/ListaClientes";
import { NuevoCliente } from "./components/NuevoCliente";
import { EditarCliente } from "./components/EditarCliente";

function AppClientes() {
  return (
    <Routes>
      <Route path="/" element={<ListaClientes />} />
      <Route path="nuevocliente" element={<NuevoCliente />} />
      <Route path="editarcliente/:id" element={<EditarCliente />} />
    </Routes>
  );
}

export default AppClientes;
