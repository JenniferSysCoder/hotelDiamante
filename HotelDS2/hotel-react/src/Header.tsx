import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import logo from "../img/logoHotelDiamante.png";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link
          to="/dashboard"
          className="logo-link"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <img
            src={logo}
            alt="Hotel Diamante Logo"
            style={{ height: "40px" }}
          />
          <h1 style={{ margin: 0 }}>Hotel Diamante</h1>
        </Link>
      </div>
      <div className="user-info">
        <FaUser
          size={20}
          style={{ marginRight: "8px" }}
          title="Administrador"
        />
        <span className="username">Administrador</span>
        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FaSignOutAlt size={18} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
