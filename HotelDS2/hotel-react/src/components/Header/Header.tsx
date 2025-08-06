import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBell, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
} from "reactstrap";

interface Notificacion {
  id: number;
  mensaje: string;
  leida: boolean;
}

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [username, setUsername] = useState("Administrador");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    console.log("Header montado - escuchando eventos de reserva");
    
    const usuarioGuardado = sessionStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsername(usuarioGuardado);
    }

    const handleNuevaReserva = (event: CustomEvent) => {
      console.log("🔔 Evento de nueva reserva recibido:", event.detail);
      const { numeroHabitacion, clienteNombre } = event.detail;
      const nuevaNoti: Notificacion = {
        id: Date.now(),
        mensaje: `Nueva reserva: Habitación ${numeroHabitacion} - ${clienteNombre || 'Cliente'}`,
        leida: false,
      };
      console.log("📝 Agregando notificación:", nuevaNoti);
      setNotificaciones((prev) => {
        const updated = [nuevaNoti, ...prev];
        console.log("📋 Total notificaciones:", updated.length);
        return updated;
      });
    };

    window.addEventListener("nueva-reserva", handleNuevaReserva as EventListener);

    return () => {
      console.log("Header desmontado - removiendo listeners");
      window.removeEventListener("nueva-reserva", handleNuevaReserva as EventListener);
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const marcarComoLeida = (id: number) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };
  const cerrarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };
  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <>
      <style>
        {`
          @media (max-width: 767.98px) {
            header {
              left: 0 !important;
              width: 100% !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              z-index: 1100 !important;
            }
            .btn-logout-mobile {
              display: flex !important;
            }
            .user-info {
              display: none !important;
            }
            .btn-hamburger {
              display: flex !important;
            }
            .header-logo h1 {
              font-size: 1rem !important;
            }
          }
          .btn-logout-mobile {
            display: none;
            background: none;
            border: none;
            font-size: 1.25rem;
            color: #475569;
            cursor: pointer;
          }
          .btn-hamburger {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #475569;
            cursor: pointer;
            margin-right: 1rem;
          }
        `}
      </style>

      <header
        className="d-flex align-items-center justify-content-between px-3 px-md-4"
        style={{
          position: "fixed",
          top: 0,
          left: 0,            // Aquí está el cambio para que quede pegado a la izquierda
          width: "100%",      // Aquí el header abarcará todo el ancho
          height: 70,
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 999,
          transition: "left 0.3s ease, width 0.3s ease",
        }}
      >
        {/* Botón hamburguesa móvil */}
        <button
          className="btn-hamburger d-flex d-md-none align-items-center justify-content-center"
          aria-label="Abrir menú"
          onClick={onToggleSidebar}
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="d-flex align-items-center gap-2 header-logo" style={{ whiteSpace: "nowrap" }}>
          <Link
            to="/dashboard"
            className="text-decoration-none"
            style={{ color: "#1e293b" }}
          >
            <h1 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
              Panel Empresarial
            </h1>
          </Link>
        </div>

        {/* Contenido derecho */}
        <div className="d-flex align-items-center gap-3">
          {/* Notificaciones */}
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="link" className="position-relative p-0">
              <FaBell size={20} style={{ color: "#475569" }} />
              {noLeidas > 0 && (
                <Badge
                  color="danger"
                  pill
                  className="position-absolute"
                  style={{
                    top: "-6px",
                    right: "-6px",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    padding: "3px 6px",
                    borderRadius: "50%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    lineHeight: 1,
                  }}
                >
                  {noLeidas}
                </Badge>
              )}
            </DropdownToggle>
            <DropdownMenu
              style={{
                minWidth: 280,
                borderRadius: 8,
                padding: "0.5rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                maxHeight: "320px",
                overflowY: "auto",
              }}
              end
            >
              <DropdownItem header style={{ fontWeight: 600, color: "#1e293b" }}>
                Notificaciones
              </DropdownItem>
              {notificaciones.length === 0 ? (
                <DropdownItem disabled style={{ fontStyle: "italic", color: "#64748b" }}>
                  No hay notificaciones
                </DropdownItem>
              ) : (
                <>
                  {notificaciones.map((n) => (
                    <DropdownItem
                      key={n.id}
                      className={`d-flex justify-content-between align-items-center ${
                        n.leida ? "" : "fw-semibold bg-light"
                      }`}
                      style={{ borderRadius: 6, marginBottom: 4, whiteSpace: "normal" }}
                    >
                      <span>{n.mensaje}</span>
                      <div className="d-flex gap-2 ms-2 flex-shrink-0">
                        {!n.leida && (
                          <Button
                            size="sm"
                            color="link"
                            onClick={() => marcarComoLeida(n.id)}
                            title="Marcar como leída"
                            style={{ color: "#475569", padding: "0 4px" }}
                          >
                            ✔
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => cerrarNotificacion(n.id)}
                          title="Eliminar notificación"
                          style={{ color: "#475569", padding: "0 4px" }}
                        >
                          ✖
                        </Button>
                      </div>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem
                    onClick={marcarTodasComoLeidas}
                    style={{ textAlign: "center", fontWeight: 600, color: "#2a72f6", cursor: "pointer" }}
                  >
                    Marcar todas como leídas
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>

          {/* Usuario y botón cerrar sesión desktop */}
          <div
            className="d-none d-md-flex align-items-center gap-2 rounded-pill px-3 py-1 user-info"
            style={{
              backgroundColor: "#e9eff5",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              color: "#1e293b",
            }}
          >
            <Link 
              to="/perfil" 
              className="d-flex align-items-center gap-2 text-decoration-none"
              style={{ color: "#1e293b" }}
            >
              <FaUser style={{ color: "#64748b" }} />
              <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>{username}</span>
            </Link>
          </div>

          <button
            className="btn d-none d-md-flex"
            style={{
              backgroundColor: "#e9eff5",
              borderRadius: 24,
              color: "#475569",
              fontWeight: 500,
              fontSize: "0.95rem",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => {
              sessionStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = "#e6f0ff";
              btn.style.color = "#2a72f6";
              btn.style.boxShadow = "0 2px 8px rgba(42,114,246,0.15)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = "#e9eff5";
              btn.style.color = "#475569";
              btn.style.boxShadow = "0 1px 5px rgba(0,0,0,0.05)";
            }}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt />
            <span className="d-none d-md-inline">Cerrar sesión</span>
          </button>

          {/* Botón cerrar sesión móvil */}
          <button
            className="btn-logout-mobile"
            onClick={() => {
              sessionStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>
    </>
  );
}
