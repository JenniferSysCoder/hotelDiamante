import { Route, Routes } from "react-router-dom";
import { ListaHotel } from "../ListaHotel";
import { NuevoHotel } from "../NuevoHotel";
import { EditarHotel } from "../EditarHotel";

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
