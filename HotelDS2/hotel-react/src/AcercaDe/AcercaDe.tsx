import React from "react";
import logo from "../../img/logoHotelDiamante.png";
import "bootstrap/dist/css/bootstrap.min.css";

const AcercaDe: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="text-center mb-4">
        <img src={logo} alt="Hotel Diamante" style={{ width: 100 }} />
        <h1 className="text-warning mt-3 fw-bold">Hotel Diamante</h1>
      </div>

      <div className="container">
        {/* Acerca de Nosotros */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-0 border-start border-4 border-danger">
            <h5 className="text-danger fw-bold">Acerca de Nosotros</h5>
          </div>
          <div className="card-body">
            <p>
              <strong className="text-warning">Hotel Diamante</strong> es un
              sistema diseñado para optimizar la gestión y operación de nuestro
              hotel, brindando una experiencia eficiente tanto para nuestro
              personal como para nuestros valiosos huéspedes.
            </p>
            <p>
              Nos esforzamos por combinar la tecnología más avanzada con el
              servicio de lujo que nos distingue.
            </p>
            <p>
              Nuestro compromiso es ofrecer herramientas intuitivas y robustas
              que faciliten cada aspecto de la administración hotelera, desde
              reservas y check-in hasta la gestión de habitaciones y servicios.
            </p>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-0 border-start border-4 border-danger">
            <h5 className="text-danger fw-bold">Información del Sistema</h5>
          </div>
          <div className="card-body">
            <p>
              <strong className="text-warning">Nombre del Sistema:</strong>{" "}
              Gestión Hotelera Diamante
            </p>
            <p>
              <strong className="text-warning">Versión:</strong> 1.0.0 (Beta)
            </p>
            <p>
              <strong className="text-warning">Desarrollado por:</strong>
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: 0 }}>
              <li>Daniel Alexander Reyes Pérez</li>
              <li>Jennifer Tatiana Guerra Figueroa</li>
              <li>Gilberto José Menéndez Pérez</li>
              <li>Milton Azareel Cuadra Mezquita</li>
            </ul>
            <p>
              <strong className="text-warning">
                Fecha de Última Actualización:
              </strong>{" "}
              26 de Mayo de 2025
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted small mt-5">
          &copy; 2025 Hotel Diamante. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default AcercaDe;
