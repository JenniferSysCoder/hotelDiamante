import { Route, Routes } from "react-router-dom";
import { ListaHotel } from "./components/ListaHotel";
import { NuevoHotel } from "./components/NuevoHotel";
import { EditarHotel } from "./components/EditarHotel";

function AppHotel() {
  return (
    <Routes>
      <Route path="/" element={<ListaHotel />} />
      <Route path="nuevohotel" element={<NuevoHotel />} />
      <Route path="editarhotel/:id" element={<EditarHotel />} />
    </Routes>
  );
}

export default AppHotel;
