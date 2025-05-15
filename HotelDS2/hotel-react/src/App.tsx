import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppHotel from './Hotel/AppHotel';
import AppClientes from './Clientes/AppClientes';
import AppEmpleados from './Empleados/AppEmpleados';
import AppHabitaciones from './Habitaciones/AppHabitaciones';
import AppReservas from './Reservas/AppReservas';
import AppServicios from './serviciosAdicionales/AppServicios';
import AppLimpiezas from './Limpiezas/AppLimpiezas';
import AppFacturas from './Facturas/AppFacturas';
import AppPagos from './Pagos/AppPagos';

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/hotel/*" element={<AppHotel />} />
              <Route path="/clientes/*" element={<AppClientes />} />
              <Route path="/empleados/*" element={<AppEmpleados />} />
              <Route path="/habitaciones/*" element={<AppHabitaciones />} />
              <Route path="/reservas/*" element={<AppReservas />} />
              <Route path="/servicios/*" element={<AppServicios />} />
              <Route path="/limpiezas/*" element={<AppLimpiezas />} />
              <Route path="/facturas/*" element={<AppFacturas />} />
              <Route path="/pagos/*" element={<AppPagos />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
