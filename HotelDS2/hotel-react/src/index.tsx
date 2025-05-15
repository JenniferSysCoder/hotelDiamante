import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppHotel from "./Hotel/AppHotel";  
import AppHabitaciones from "./Habitaciones/AppHabitaciones";  
function index() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <h2>Sistema Hotelero</h2>
        <nav className="mb-4">
          <a href="/hoteles" className="btn btn-primary me-2">Hoteles</a>
          <a href="/habitaciones" className="btn btn-success">Habitaciones</a>
        </nav>
        <Routes>
          <Route path="/hoteles/*" element={<AppHotel />} />
          <Route path="/habitaciones/*" element={<AppHabitaciones />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default index;
