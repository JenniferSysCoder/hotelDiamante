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
  FaInfoCircle,
  FaWrench,
  FaUser,
  FaComments,
} from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
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

  // Fondo negro sólido en todo el sidebar, sin textura ni patrón
  const sidebarBg = {
    background: "#111", // negro sólido
    minHeight: "100vh",
    boxShadow: "2px 0 16px #00000022",
    padding: "0",
    width: "220px",
    transition: "width 0.2s",
  };

  const destacadoStyle = {
    background: "#111",
    color: "#fff",
    boxShadow: "0 2px 8px #00000022",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "16px 20px",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backdropFilter: "blur(2px)",
  };

  const flechaStyle = {
    marginLeft: "auto",
    fontSize: "1rem",
    transition: "transform 0.2s",
    color: "#fff",
    alignSelf: "center",
  };

  return (
    <aside className="sidebar" style={sidebarBg}>
      <nav>
        <ul style={{ paddingTop: "90px" }}>
          {/* Dashboard con fondo destacado */}
          <li style={{ marginBottom: "16px" }}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `menu-item dashboard-link ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
            >
              <FaTachometerAlt
                className="icon"
                style={{ fontSize: "1.5rem" }}
              />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Menú Controles */}
          <li>
            <button
              className="menu-item dropdown-toggle"
              onClick={() => toggleMenu("controles")}
              style={{
                ...destacadoStyle,
                borderRadius: "32px",
                boxShadow: openMenus.controles ? "0 4px 24px #1e293b" : destacadoStyle.boxShadow,
                background: openMenus.controles ? "#1e293b" : destacadoStyle.background,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.boxShadow = "0 4px 24px #1e293b";
                e.currentTarget.style.borderRadius = "32px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = destacadoStyle.background;
                e.currentTarget.style.boxShadow = destacadoStyle.boxShadow;
                e.currentTarget.style.borderRadius = "32px";
              }}
            >
              <FaWrench className="icon" />
              <span>Controles</span>
              <FaChevronDown
                style={{
                  ...flechaStyle,
                  transform: openMenus.controles
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            <ul className={`submenu ${openMenus.controles ? "show" : ""}`}>
              <li>
                <NavLink
                  to="/hotel"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaHotel className="icon" /> Hoteles
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/habitaciones"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaBed className="icon" /> Habitaciones
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaUserFriends className="icon" /> Clientes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleados"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaUsersCog className="icon" /> Empleados
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/servicios"
                  className="menu-item"
                  style={destacadoStyle}
                >
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
              style={{
                ...destacadoStyle,
                borderRadius: "32px",
                boxShadow: openMenus.operaciones ? "0 4px 24px #1e293b" : destacadoStyle.boxShadow,
                background: openMenus.operaciones ? "#1e293b" : destacadoStyle.background,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.boxShadow = "0 4px 24px #1e293b";
                e.currentTarget.style.borderRadius = "32px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = destacadoStyle.background;
                e.currentTarget.style.boxShadow = destacadoStyle.boxShadow;
                e.currentTarget.style.borderRadius = "32px";
              }}
            >
              <FaTools className="icon" />
              <span>Operaciones</span>
              <FaChevronDown
                style={{
                  ...flechaStyle,
                  transform: openMenus.operaciones
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            <ul className={`submenu ${openMenus.operaciones ? "show" : ""}`}>
              <li>
                <NavLink
                  to="/reservas"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaCalendarCheck className="icon" /> Reservas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/limpiezas"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaBroom className="icon" /> Limpiezas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/facturas"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaFileInvoice className="icon" /> Facturación
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pagos"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaCreditCard className="icon" /> Pagos
                </NavLink>
              </li>
            </ul>
          </li>

          {/* Menú Informes */}
          <li>
            <button
              className="menu-item dropdown-toggle"
              onClick={() => toggleMenu("informes")}
              style={{
                ...destacadoStyle,
                borderRadius: "32px",
                boxShadow: openMenus.informes ? "0 4px 24px #1e293b" : destacadoStyle.boxShadow,
                background: openMenus.informes ? "#1e293b" : destacadoStyle.background,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.boxShadow = "0 4px 24px #1e293b";
                e.currentTarget.style.borderRadius = "32px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = destacadoStyle.background;
                e.currentTarget.style.boxShadow = destacadoStyle.boxShadow;
                e.currentTarget.style.borderRadius = "32px";
              }}
            >
              <FaFileAlt className="icon" />
              <span>Informes</span>
              <FaChevronDown
                style={{
                  ...flechaStyle,
                  transform: openMenus.informes
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            <ul className={`submenu ${openMenus.informes ? "show" : ""}`}>
              <li>
                <NavLink
                  to="/ReporteReserva"
                  className="menu-item"
                  style={destacadoStyle}
                >
                  <FaFileAlt className="icon" /> Reporte Reservas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ReporteServicio"
                  className="menu-item"
                  style={destacadoStyle}
                >
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
              style={destacadoStyle}
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
              style={destacadoStyle}
            >
              <FaUser className="icon" /> Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/opiniones"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
            >
              <FaComments className="icon" /> Opiniones
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/acercade"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
            >
              <FaInfoCircle className="icon" /> Acerca De
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
