import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHotel,
  FaBed,
  FaUserFriends,
  FaUsersCog,
  FaConciergeBell,
  FaCalendarCheck,
  FaBroom,
  FaFileInvoice,
  FaCreditCard,
  FaFileAlt,
  FaTachometerAlt,
  FaTools,
  FaChevronDown,
  FaUser,
  FaComments,
  FaInfoCircle,
  FaTimes,
  FaCog,
  FaChartLine,
} from "react-icons/fa";

const getRol = () => sessionStorage.getItem("rol");

const puedeVer = (rolesPermitidos: (string | null)[]) => {
  const rolActual = getRol();
  return rolesPermitidos.includes(rolActual);
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState({
    controles: false,
    operaciones: false,
    informes: false,
    configuracion: false,
    analisis: false,
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      <aside
        className="bg-white border-end d-flex flex-column position-fixed start-0"
        style={{
          width: 250,
          transition: "transform 0.3s ease-in-out",
          transform:
            window.innerWidth < 768
              ? isOpen
                ? "translateX(0)"
                : "translateX(-100%)"
              : "translateX(0)",
          zIndex: 1055,
          top: 70,
          height: "calc(100vh - 70px)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <FaHotel className="text-primary fs-4" />
            <span className="fs-5 fw-bold text-primary">Hotel Diamante</span>
          </div>
          <button
            className="btn btn-outline-primary d-md-none"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-grow-1 overflow-auto">
          <ul className="nav flex-column px-2 py-3">
            <li className="nav-item mb-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 ${
                    isActive ? "active bg-primary text-white" : "text-dark"
                  } rounded`
                }
                onClick={onClose}
              >
                <FaTachometerAlt />
                Dashboard
              </NavLink>
            </li>

            {/* Controles */}
            {puedeVer(["Administrador", "Recepcionista"]) && (
              <li className="nav-item mb-1">
                <button
                  className="btn btn-toggle align-items-center rounded collapsed w-100 text-start d-flex justify-content-between align-items-center"
                  onClick={() => toggleMenu("controles")}
                  aria-expanded={openMenus.controles}
                  type="button"
                >
                  <span className="d-flex align-items-center gap-2">
                    <FaTools />
                    Controles
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${
                      openMenus.controles ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className={`collapse ${openMenus.controles ? "show" : ""} ps-4`}>
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {puedeVer(["Administrador"]) && (
                      <li>
                        <NavLink to="/hotel" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                          <FaHotel /> Hoteles
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink to="/habitaciones" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaBed /> Habitaciones
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/clientes" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaUserFriends /> Clientes
                      </NavLink>
                    </li>
                    {puedeVer(["Administrador"]) && (
                      <li>
                        <NavLink to="/empleados" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                          <FaUsersCog /> Empleados
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink to="/servicios" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaConciergeBell /> Servicios
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            {/* Operaciones */}
            <li className="nav-item mb-1">
              <button
                className="btn btn-toggle align-items-center rounded collapsed w-100 text-start d-flex justify-content-between align-items-center"
                onClick={() => toggleMenu("operaciones")}
                aria-expanded={openMenus.operaciones}
                type="button"
              >
                <span className="d-flex align-items-center gap-2">
                  <FaTools />
                  Operaciones
                </span>
                <FaChevronDown
                  className={`transition-transform ${openMenus.operaciones ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`collapse ${openMenus.operaciones ? "show" : ""} ps-4`}>
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  {puedeVer(["Administrador", "Recepcionista"]) && (
                    <li>
                      <NavLink to="/reservas" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaCalendarCheck /> Reservas
                      </NavLink>
                    </li>
                  )}
                  {puedeVer(["Administrador", "Encargado de Limpieza"]) && (
                    <li>
                      <NavLink to="/limpiezas" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaBroom /> Limpiezas
                      </NavLink>
                    </li>
                  )}
                  {puedeVer(["Administrador", "Recepcionista"]) && (
                    <>
                      <li>
                        <NavLink to="/facturas" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                          <FaFileInvoice /> Facturación
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/pagos" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                          <FaCreditCard /> Pagos
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </li>

            {/* Informes */}
            {puedeVer(["Administrador"]) && (
              <li className="nav-item mb-1">
                <button
                  className="btn btn-toggle align-items-center rounded collapsed w-100 text-start d-flex justify-content-between align-items-center"
                  onClick={() => toggleMenu("informes")}
                  aria-expanded={openMenus.informes}
                  type="button"
                >
                  <span className="d-flex align-items-center gap-2">
                    <FaFileAlt />
                    Informes
                  </span>
                  <FaChevronDown className={`transition-transform ${openMenus.informes ? "rotate-180" : ""}`} />
                </button>
                <div className={`collapse ${openMenus.informes ? "show" : ""} ps-4`}>
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li>
                      <NavLink to="/ReporteReserva" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaFileAlt /> Reporte Reservas
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/ReporteServicio" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaFileAlt /> Reporte Servicio
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            

            {/* Análisis */}
            {puedeVer(["Administrador", "Recepcionista"]) && (
              <li className="nav-item mb-1">
                <NavLink
                  to="/analisis-completo"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 ${
                      isActive ? "active bg-primary text-white" : "text-dark"
                    } rounded`
                  }
                  onClick={onClose}
                >
                  <FaChartLine /> Análisis Completo
                </NavLink>
              </li>
            )}

            <li className="nav-item mb-1">
              <NavLink to="/calendario" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                <FaCalendarCheck /> Calendario
              </NavLink>
            </li>

            <li className="nav-item mb-1">
              <NavLink to="/opiniones" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                <FaComments /> Opiniones
              </NavLink>
            </li>

            {/* Configuración */}
            {puedeVer(["Administrador"]) && (
              <li className="nav-item mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed w-100 text-start d-flex justify-content-between align-items-center" onClick={() => toggleMenu("configuracion")} aria-expanded={openMenus.configuracion} type="button">
                  <span className="d-flex align-items-center gap-2">
                    <FaCog /> Configuración
                  </span>
                  <FaChevronDown className={`transition-transform ${openMenus.configuracion ? "rotate-180" : ""}`} />
                </button>
                <div className={`collapse ${openMenus.configuracion ? "show" : ""} ps-4`}>
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li>
                      <NavLink to="/usuarios" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaUser /> Usuarios
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/roles" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                        <FaUsersCog /> Roles
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            <li className="nav-item mb-1">
              <NavLink to="/acercade" className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-primary text-white" : "text-dark"} rounded`} onClick={onClose}>
                <FaInfoCircle /> Acerca De
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
