import './Header.css'; // O directamente en App.css si estás unificando estilos

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Hotel Diamante</h1>
      </div>
      <div className="user-info">
        <span className="username">Administrador</span>
        <button className="logout-btn">Cerrar sesión</button>
      </div>
    </header>
  );
}
