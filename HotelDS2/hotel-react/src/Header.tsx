import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import logo from "../img/logoHotelDiamante.png";
import "./Header.css";
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

export default function Header() {
  const [username, setUsername] = useState("Administrador");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsername(usuarioGuardado);
    }

    const handleNuevaReserva = (event: CustomEvent) => {
      const { numeroHabitacion } = event.detail;
      const nuevaNoti: Notificacion = {
        id: Date.now(),
        mensaje: `Se realizó una reserva para la habitación número ${numeroHabitacion}`,
        leida: false,
      };
      setNotificaciones((prev) => [nuevaNoti, ...prev]);
    };

    window.addEventListener("nueva-reserva", handleNuevaReserva as EventListener);

    return () => {
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
    <header className="header" style={{
      background: "#b71c1c", // Rojo más oscuro
      boxShadow: "0 2px 12px #7f1d1d22",
      padding: "6px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: "54px"
    }}>
      <div className="logo" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link to="/dashboard" className="logo-link" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <img src={logo} alt="Hotel Diamante Logo" style={{ height: "38px", width: "38px", borderRadius: "8px", boxShadow: "0 2px 8px #7f1d1d22" }} />
          <h1 style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "2px",
            margin: 0,
            textShadow: "0 2px 8px #7f1d1d44"
          }}>Hotel Diamante</h1>
        </Link>
      </div>
      <div className="user-info" style={{
        display: "flex",
        alignItems: "center",
        gap: "18px"
      }}>
        <div className="notification-wrapper" style={{ position: "relative" }}>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="link" className="position-relative p-0" style={{ outline: "none" }}>
              <FaBell size={18} color="#fff" style={{ verticalAlign: "middle" }} />
              {noLeidas > 0 && (
                <Badge className="badge-noti" style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#fff",
                  color: "#b71c1c",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  fontSize: "0.8rem",
                  boxShadow: "0 2px 8px #7f1d1d22"
                }}>
                  {noLeidas}
                </Badge>
              )}
            </DropdownToggle>
            <DropdownMenu className="noti-dropdown" style={{
              minWidth: "260px",
              background: "#fff",
              border: "1px solid #b71c1c",
              boxShadow: "0 2px 12px #7f1d1d22",
              padding: "0.5rem"
            }}>
              <DropdownItem header className="noti-header" style={{
                fontWeight: "bold",
                color: "#b71c1c",
                background: "#fff",
                borderBottom: "1px solid #b71c1c"
              }}>
                Notificaciones
              </DropdownItem>
              {notificaciones.length === 0 ? (
                <DropdownItem disabled className="noti-item" style={{ color: "#7f1d1d" }}>
                  No hay notificaciones
                </DropdownItem>
              ) : (
                <>
                  {notificaciones.map((n) => (
                    <DropdownItem key={n.id} className="noti-item" style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: n.leida ? "#f8f8f8" : "#ffebee",
                      color: "#7f1d1d",
                      fontWeight: n.leida ? "normal" : "bold",
                      borderRadius: "6px",
                      marginBottom: "4px",
                      padding: "6px 10px",
                      fontSize: "0.95rem"
                    }}>
                      <div className="noti-msg" style={{ flex: 1 }}>
                        <span>{n.mensaje}</span>
                      </div>
                      <div className="noti-actions" style={{ display: "flex", gap: "6px" }}>
                        {!n.leida && (
                          <Button
                            size="sm"
                            color="link"
                            onClick={() => marcarComoLeida(n.id)}
                            title="Marcar como leída"
                            style={{ color: "#b71c1c", fontWeight: "bold" }}
                          >
                            ✔
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => cerrarNotificacion(n.id)}
                          title="Eliminar notificación"
                          style={{ color: "#7f1d1d", fontWeight: "bold" }}
                        >
                          ✖
                        </Button>
                      </div>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem onClick={marcarTodasComoLeidas} className="noti-item" style={{
                    color: "#b71c1c",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}>
                    Marcar todas como leídas
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#fff",
          borderRadius: "24px",
          padding: "4px 12px",
          boxShadow: "0 2px 8px #7f1d1d22"
        }}>
          <FaUser size={16} color="#b71c1c" title={username} />
          <span className="username" style={{
            fontWeight: "bold",
            color: "#23272f",
            fontSize: "0.95rem"
          }}>{username}</span>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
          style={{
            background: "#fff",
            color: "#b71c1c",
            border: "none",
            borderRadius: "24px",
            padding: "4px 12px",
            fontWeight: "bold",
            fontSize: "0.95rem",
            boxShadow: "0 2px 8px #7f1d1d22",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s"
          }}
        >
          <FaSignOutAlt size={16} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}