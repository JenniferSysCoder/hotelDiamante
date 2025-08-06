import { Route, Routes } from "react-router-dom";
import { ListaEmpleado } from "../ListaEmpleados";
import { NuevoEmpleado } from "../NuevoEmpleado";
import {EditarEmpleadoModal} from "../EditarEmpleado";

function AppEmpleados() {
  return (
    <Routes>
      <Route path="/" element={<ListaEmpleado />} />
      <Route path="nuevoempleado" element={<NuevoEmpleado />} />
      <Route path="editarempleado/:id" element={<EditarEmpleadoModal idEmpleado={0} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } />} />
    </Routes>
  );
}

export default AppEmpleados;
