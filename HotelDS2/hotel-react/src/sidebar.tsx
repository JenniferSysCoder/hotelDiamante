import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaHotel,
  FaBed,
  FaUserFriends,
  FaUsersCog,
  FaConciergeBell,
  FaCalendarAlt,
  FaFileAlt,
  FaTachometerAlt,
  FaTools,
  FaCalendarCheck,
  FaBroom,
  FaCreditCard,
  FaFileInvoice,
  FaChevronDown,
  FaInfoCircle,
  FaWrench,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    controles: false,
    operaciones: false,
    informes: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prevMenus) => ({
      ...prevMenus,
      [menu]: !prevMenus[menu],
    }));
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaTachometerAlt className="icon" />
            </NavLink>
          </li>

          {/* Menú Controles */}
          <li>
            <button
              className="menu-item dropdown-toggle"
              onClick={() => toggleMenu("controles")}
            >
              <FaWrench className="icon" />
              <span>Controles</span>
              <FaChevronDown
                className={`chevron ${openMenus.controles ? "rotate" : ""}`}
              />
            </button>

            <ul className={`submenu ${openMenus.controles ? "show" : ""}`}>
              <li>
                <NavLink to="/hotel" className="menu-item">
                  <FaHotel className="icon" /> Hoteles
                </NavLink>
              </li>
              <li>
                <NavLink to="/habitaciones" className="menu-item">
                  <FaBed className="icon" /> Habitaciones
                </NavLink>
              </li>
              <li>
                <NavLink to="/clientes" className="menu-item">
                  <FaUserFriends className="icon" /> Clientes
                </NavLink>
              </li>
              <li>
                <NavLink to="/empleados" className="menu-item">
                  <FaUsersCog className="icon" /> Empleados
                </NavLink>
              </li>
              <li>
                <NavLink to="/servicios" className="menu-item">
                  <FaConciergeBell className="icon" /> Servicios
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Menú Operaciones */}
          <li>
            <button
              className="menu-item dropdown-toggle"
              onClick={() => toggleMenu("operaciones")}
            >
              <FaTools className="icon" />
              <span>Operaciones</span>
              <FaChevronDown
                className={`chevron ${openMenus.operaciones ? "rotate" : ""}`}
              />
            </button>

            <ul className={`submenu ${openMenus.operaciones ? "show" : ""}`}>
              <li>
                <NavLink to="/reservas" className="menu-item">
                  <FaCalendarCheck className="icon" /> Reservas
                </NavLink>
              </li>
              <li>
                <NavLink to="/limpiezas" className="menu-item">
                  <FaBroom className="icon" /> Limpiezas
                </NavLink>
              </li>
              <li>
                <NavLink to="/facturas" className="menu-item">
                  <FaFileInvoice className="icon" /> Facturación
                </NavLink>
              </li>
              <li>
                <NavLink to="/pagos" className="menu-item">
                  <FaCreditCard className="icon" /> Pagos
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Menú Informes con submenú */}
          <li>
            <button
              className="menu-item dropdown-toggle"
              onClick={() => toggleMenu("informes")}
            >
              <FaFileAlt className="icon" />
              <span>Informes</span>
              <FaChevronDown
                className={`chevron ${openMenus.informes ? "rotate" : ""}`}
              />
            </button>

            <ul className={`submenu ${openMenus.informes ? "show" : ""}`}>
              <li>
                <NavLink to="/ReporteReserva" className="menu-item">
                  <FaFileAlt className="icon" /> Reporte Reservas
                </NavLink>
              </li>
              <li>
                <NavLink to="/ReporteServicio" className="menu-item">
                  <FaFileAlt className="icon" /> Reporte Servicio
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/calendario"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaCalendarAlt className="icon" /> Calendario
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaUser className="icon" /> Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/acercade"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <FaInfoCircle className="icon" /> Acerca De
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
