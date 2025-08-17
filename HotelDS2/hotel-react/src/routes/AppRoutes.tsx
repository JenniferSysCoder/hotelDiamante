import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import PrivateRoute from "../pages/Login/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";

import AppHotel from "../pages/Hotel/Routes/RouteHotel";
import AppClientes from "../pages/Clientes/routes/RouteClientes";
import AppEmpleados from "../pages/Empleados/routes/RouteEmpleados";
import AppHabitaciones from "../pages/Habitaciones/routes/RouteHabitaciones";
import AppReservas from "../pages/Reservas/routes/RouteReservas";
import AppServicios from "../pages/serviciosAdicionales/Routes/RouteServicios";
import AppLimpiezas from "../pages/Limpiezas/routes/RouteLimpiezas";
import AppFacturas from "../pages/Facturas/routes/RouteFacturas";
import AppPagos from "../pages/Pagos/routes/RoutePagos";
import AppReporteReservas from "../pages/ReporteReservas/AppReporteReservas";
import AppReporteServicios from "../pages/ReporteServicios/AppReporteServicios";
import { DashboardHabitaciones } from "../pages/Dashboard/components/DSHabitacion";
import { DashboardServicios } from "../pages/Dashboard/components/DHServicio";
import { DashboardProyeccionReservas } from "../pages/Dashboard/components/DHProyeccionReservas";
import CalendarioReservas from "../pages/Calendario/CalendarioReservas";
import DashboardGanancias from "../pages/Dashboard/components/DashboardGanancias";
import AppUsuario from "../pages/Usuarios/routes/RouteUsuarios";
import AcercaDe from "../pages/AcercaDe/AcercaDe";
import AppRol from "../pages/Roles/routes/RouteRoles";

import Login from "../pages/Login/Login";
import NoAutorizado from "../pages/Login/NoAutorizado";
import { useEffect, useState } from "react";
import AppDashboard from "../pages/Dashboard/AppDashboard";
import PerfilUsuario from "../pages/Perfil/PerfilUsuario";
import { Row } from "reactstrap";

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setIsDesktop] = useState(window.innerWidth >= 768);


  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Todas las rutas protegidas */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            
            <div className="app-container" style={{ minHeight: "100vh" }}>
              <Header onToggleSidebar={toggleSidebar} />
              <div className="container-fluid" style={{ paddingTop: 70 }}>
                <div className="row">
                  <div className="col-12 col-md-3 col-lg-2 mb-3" style={{ paddingLeft: "0.75rem" }}>
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                  </div>
                  <div
                    className="col-12 col-md-9 col-lg-10"
                    onClick={closeSidebar}
                    style={{
                      padding: 20,
                      height: "calc(100vh - 70px)",
                      overflowY: "auto",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Routes>
                      <Route path="/no-autorizado" element={<NoAutorizado />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<AppDashboard />} />
                      <Route path="/dashboardHabitaciones" element={<DashboardHabitaciones />} />
                      <Route path="/proyeccion-reservas" element={<DashboardProyeccionReservas />} />
                      <Route path="/calendario" element={<CalendarioReservas />} />
                      <Route path="/acercade" element={<AcercaDe />} />
                      <Route path="/perfil" element={<PerfilUsuario />} />

                      {/* Rutas protegidas por rol */}
                      <Route path="/hotel/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppHotel /></PrivateRoute>} />
                      <Route path="/clientes/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppClientes /></PrivateRoute>} />
                      <Route path="/empleados/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppEmpleados /></PrivateRoute>} />
                      <Route path="/habitaciones/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppHabitaciones /></PrivateRoute>} />
                      <Route path="/reservas/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppReservas /></PrivateRoute>} />
                      <Route path="/servicios/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppServicios /></PrivateRoute>} />
                      <Route path="/limpiezas/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Encargado de Limpieza"]}><AppLimpiezas /></PrivateRoute>} />
                      <Route path="/facturas/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppFacturas /></PrivateRoute>} />
                      <Route path="/pagos/*" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><AppPagos /></PrivateRoute>} />
                      <Route path="/usuarios/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppUsuario /></PrivateRoute>} />
                      <Route path="/roles/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppRol /></PrivateRoute>} />
                      <Route path="/ReporteReserva/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppReporteReservas /></PrivateRoute>} />
                      <Route path="/ReporteServicio/*" element={<PrivateRoute rolesPermitidos={["Administrador"]}><AppReporteServicios /></PrivateRoute>} />
                      <Route path="/proyeccionReservas" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><DashboardProyeccionReservas /></PrivateRoute>} />
                      <Route path="/ganancias" element={<PrivateRoute rolesPermitidos={["Administrador", "Recepcionista"]}><DashboardGanancias /></PrivateRoute>} />
                      <Route
                        path="/analisis-completo"
                        element={
                          <div className="container-fluid py-4">
                            <h2 className="mb-4 fw-bold">Análisis y Proyecciones</h2>
                            <Row className="mb-4">
                              <DashboardProyeccionReservas />
                              <DashboardServicios />
                              
                            </Row>
                            <Row>
                              <DashboardGanancias />
                            </Row>
                          </div>
                        } 
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
