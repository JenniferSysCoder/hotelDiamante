import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './Header';
import PrivateRoute from './Login/PrivateRoute'; // ruta correcta a PrivateRoute
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
import AppReporteReservas from './ReporteReservas/AppReporteReservas';
import AppReporteServicios from './ReporteServicios/AppReporteServicios';
import { DashboardHabitaciones } from './Dashboard/components/DSHabitacion';
import AppDashboard from './Dashboard/AppDashboard';
import { DashboardProyeccionReservas } from './Dashboard/components/DHProyeccionReservas';
import CalendarioReservas from './Calendario/CalendarioReservas';
import UserProfile from './PerfilUsuarios/UserProfile';
import AcercaDe from './AcercaDe/AcercaDe';

import Login from './Login/Login';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con PrivateRoute */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
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
                      <Route path="/ReporteReserva/*" element={<AppReporteReservas />} />
                      <Route path="/ReporteServicio/*" element={<AppReporteServicios />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<AppDashboard />} />
                      <Route path="/dashboardHabitaciones" element={<DashboardHabitaciones />} />
                      <Route path="/dashboardProyeccion" element={<DashboardProyeccionReservas />} />
                      <Route path="/calendario" element={<CalendarioReservas />} />
                      <Route path="/userprofile" element={<UserProfile />} />
                      <Route path="/acercade" element={<AcercaDe />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Redirigir cualquier ruta desconocida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
