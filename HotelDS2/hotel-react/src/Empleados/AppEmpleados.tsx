import { Route, Routes } from "react-router-dom";
import { ListaEmpleado } from "./components/ListaEmpleados";
import { NuevoEmpleado } from "./components/NuevoEmpleado";
import { EditarEmpleado } from "./components/EditarEmpleado";

function AppEmpleados() {
  return (
    <Routes>
      <Route path="/" element={<ListaEmpleado />} />
      <Route path="nuevoempleado" element={<NuevoEmpleado />} />
      <Route path="editarempleado/:id" element={<EditarEmpleado />} />
    </Routes>
  );
}

export default AppEmpleados;
