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

  // Fondo azul oscuro sólido corporativo moderno y empresarial
  const sidebarBg = {
    background: "#1e3a8a",
    minHeight: "100vh",
    boxShadow: "4px 0 32px rgba(30, 58, 138, 0.4)",
    padding: "0",
    width: "260px",
    transition: "all 0.3s ease",
    borderRight: "3px solid rgba(59, 130, 246, 0.3)"
  };

  const destacadoStyle = {
    background: "rgba(59, 130, 246, 0.15)",
    color: "#ffffff",
    boxShadow: "0 6px 20px rgba(30, 58, 138, 0.3)",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1rem",
    padding: "16px 24px",
    marginBottom: "8px",
    margin: "0 16px 8px 16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backdropFilter: "blur(15px)",
    border: "2px solid rgba(59, 130, 246, 0.25)",
    transition: "all 0.3s ease",
    letterSpacing: "0.3px"
  };

  const flechaStyle = {
    marginLeft: "auto",
    fontSize: "1.1rem",
    transition: "transform 0.3s ease",
    color: "#93c5fd",
    alignSelf: "center",
  };

  return (
    <aside className="sidebar" style={sidebarBg}>
      <nav>
        <ul style={{ paddingTop: "90px", listStyle: "none", margin: 0, padding: "90px 0 0 0" }}>
          {/* Dashboard con fondo destacado */}
          <li style={{ marginBottom: "20px" }}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `menu-item dashboard-link ${isActive ? "active" : ""}`
              }
              style={{
                ...destacadoStyle,
                background: "rgba(59, 130, 246, 0.25)",
                border: "2px solid rgba(59, 130, 246, 0.4)",
                fontWeight: "800",
                fontSize: "1.1rem",
                boxShadow: "0 8px 28px rgba(59, 130, 246, 0.35)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.35)";
                e.currentTarget.style.transform = "translateX(8px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(59, 130, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.25)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(59, 130, 246, 0.35)";
              }}
            >
              <FaTachometerAlt
                className="icon"
                style={{ fontSize: "1.6rem", color: "#3b82f6" }}
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
                cursor: "pointer",
                border: "2px solid rgba(59, 130, 246, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.22)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 58, 138, 0.3)";
              }}
            >
              <FaWrench className="icon" style={{ fontSize: "1.3rem", color: "#60a5fa" }} />
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
            <ul className={`submenu ${openMenus.controles ? "show" : ""}`} style={{
              background: "rgba(13, 27, 62, 0.9)",
              borderRadius: "10px",
              margin: "8px 16px",
              padding: "8px 0",
              border: "2px solid rgba(59, 130, 246, 0.2)",
              backdropFilter: "blur(10px)"
            }}>
              <li>
                <NavLink
                  to="/hotel"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaHotel className="icon" style={{ color: "#3b82f6" }} /> Hoteles
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/habitaciones"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaBed className="icon" style={{ color: "#60a5fa" }} /> Habitaciones
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/clientes"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaUserFriends className="icon" style={{ color: "#93c5fd" }} /> Clientes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/empleados"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaUsersCog className="icon" style={{ color: "#3b82f6" }} /> Empleados
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/servicios"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaConciergeBell className="icon" style={{ color: "#60a5fa" }} /> Servicios
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
                cursor: "pointer",
                border: "1px solid rgba(59, 130, 246, 0.25)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaTools className="icon" style={{ fontSize: "1.3rem", color: "#60a5fa" }} />
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
            <ul className={`submenu ${openMenus.operaciones ? "show" : ""}`} style={{
              background: "rgba(15, 20, 25, 0.8)",
              borderRadius: "8px",
              margin: "8px 16px",
              padding: "8px 0",
              border: "1px solid rgba(59, 130, 246, 0.15)"
            }}>
              <li>
                <NavLink
                  to="/reservas"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaCalendarCheck className="icon" style={{ color: "#3b82f6" }} /> Reservas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/limpiezas"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaBroom className="icon" style={{ color: "#60a5fa" }} /> Limpiezas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/facturas"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaFileInvoice className="icon" style={{ color: "#93c5fd" }} /> Facturación
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pagos"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaCreditCard className="icon" style={{ color: "#3b82f6" }} /> Pagos
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
                cursor: "pointer",
                border: "1px solid rgba(59, 130, 246, 0.25)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaFileAlt className="icon" style={{ fontSize: "1.3rem", color: "#60a5fa" }} />
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
            <ul className={`submenu ${openMenus.informes ? "show" : ""}`} style={{
              background: "rgba(15, 20, 25, 0.8)",
              borderRadius: "8px",
              margin: "8px 16px",
              padding: "8px 0",
              border: "1px solid rgba(59, 130, 246, 0.15)"
            }}>
              <li>
                <NavLink
                  to="/ReporteReserva"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaFileAlt className="icon" style={{ color: "#3b82f6" }} /> Reporte Reservas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ReporteServicio"
                  className="menu-item"
                  style={{
                    ...destacadoStyle,
                    margin: "4px 8px",
                    fontSize: "0.95rem",
                    padding: "12px 20px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <FaFileAlt className="icon" style={{ color: "#60a5fa" }} /> Reporte Servicio
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaCalendarAlt className="icon" style={{ fontSize: "1.3rem", color: "#3b82f6" }} /> Calendario
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaUser className="icon" style={{ fontSize: "1.3rem", color: "#60a5fa" }} /> Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/opiniones"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaComments className="icon" style={{ fontSize: "1.3rem", color: "#93c5fd" }} /> Opiniones
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/acercade"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              style={destacadoStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.18)";
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(30, 58, 138, 0.25)";
              }}
            >
              <FaInfoCircle className="icon" style={{ fontSize: "1.3rem", color: "#3b82f6" }} /> Acerca De
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
