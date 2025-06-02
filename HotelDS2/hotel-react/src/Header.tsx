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
    <header className="header">
      <div className="logo">
        <Link to="/dashboard" className="logo-link">
          <img src={logo} alt="Hotel Diamante Logo" />
          <h1>Hotel Diamante</h1>
        </Link>
      </div>
      <div className="user-info">
        <div className="notification-wrapper">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="link" className="position-relative p-0">
              <FaBell size={20} color="white" />
              {noLeidas > 0 && (
                <Badge className="badge-noti">{noLeidas}</Badge>
              )}
            </DropdownToggle>
            <DropdownMenu className="noti-dropdown">
              <DropdownItem header className="noti-header">
                Notificaciones
              </DropdownItem>
              {notificaciones.length === 0 ? (
                <DropdownItem disabled className="noti-item">
                  No hay notificaciones
                </DropdownItem>
              ) : (
                <>
                  {notificaciones.map((n) => (
                    <DropdownItem key={n.id} className="noti-item">
                      <div className="noti-msg">
                        <span style={{ fontWeight: n.leida ? "normal" : "bold" }}>
                          {n.mensaje}
                        </span>
                      </div>
                      <div className="noti-actions">
                        {!n.leida && (
                          <Button
                            size="sm"
                            color="link"
                            onClick={() => marcarComoLeida(n.id)}
                            title="Marcar como leída"
                          >
                            ✔
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => cerrarNotificacion(n.id)}
                          title="Eliminar notificación"
                        >
                          ✖
                        </Button>
                      </div>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem onClick={marcarTodasComoLeidas} className="noti-item">
                    Marcar todas como leídas
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        <FaUser size={20} title={username} />
        <span className="username">{username}</span>
        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
        >
          <FaSignOutAlt size={18} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
