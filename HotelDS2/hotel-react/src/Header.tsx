import { Link } from 'react-router-dom';
import './Header.css'; // O directamente en App.css si estás unificando estilos

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/dashboard" className="logo-link">
          <h1>Hotel Diamante</h1>
        </Link>
      </div>
      <div className="user-info">
        <span className="username">Administrador</span>
        <button className="logout-btn">Cerrar sesión</button>
      </div>
    </header>
  );
}
