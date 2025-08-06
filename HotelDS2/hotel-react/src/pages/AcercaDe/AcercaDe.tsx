import React from "react";
import logo from "../../assets/img/logoHotelDiamante.png";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { FaInfoCircle, FaTools, FaUsers } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const AcercaDe: React.FC = () => {
  return (
    <div className="bg-light py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={6} className="text-center">
            <img src={logo} alt="Hotel Diamante" style={{ width: 80 }} />
            <h2 className="mt-3 fw-bold text-dark">Hotel Diamante</h2>
            <p className="text-muted">
              Sistema de Gestión Hotelera Profesional
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Acerca de Nosotros */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <CardHeader className="bg-white border-bottom d-flex align-items-center">
                <FaInfoCircle className="text-primary me-2" size={20} />
                <h5 className="mb-0 fw-semibold text-dark">Acerca de Nosotros</h5>
              </CardHeader>
              <CardBody>
                <p>
                  <strong className="text-primary">Hotel Diamante</strong> es un sistema moderno diseñado para optimizar la gestión y operación hotelera, mejorando la experiencia de administración y atención al cliente.
                </p>
                <p>
                  Nos apoyamos en herramientas tecnológicas robustas y eficientes para garantizar un servicio ágil, intuitivo y seguro.
                </p>
                <p>
                  Nuestro compromiso es facilitar todas las áreas críticas: reservas, check-in/out, habitaciones, pagos y más.
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Información del Sistema */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <CardHeader className="bg-white border-bottom d-flex align-items-center">
                <FaTools className="text-success me-2" size={20} />
                <h5 className="mb-0 fw-semibold text-dark">Información del Sistema</h5>
              </CardHeader>
              <CardBody>
                <p>
                  <strong className="text-primary">Sistema:</strong> Gestión Hotelera Diamante
                </p>
                <p>
                  <strong className="text-primary">Versión:</strong> 2.0.0 (Beta)
                </p>
                <p>
                  <strong className="text-primary">Última Actualización:</strong> 5 de Agosto de 2025
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Desarrolladores */}
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-white border-bottom d-flex align-items-center">
                <FaUsers className="text-warning me-2" size={20} />
                <h5 className="mb-0 fw-semibold text-dark">Equipo de Desarrollo</h5>
              </CardHeader>
              <CardBody>
                <ul className="mb-0 ps-3">
                  <li>Daniel Alexander Reyes Pérez</li>
                  <li>Jennifer Tatiana Guerra Figueroa</li>
                  <li>Gilberto José Menéndez Pérez</li>
                  <li>Milton Azareel Cuadra Mezquita</li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <div className="text-center text-muted small mt-5">
          &copy; 2025 Hotel Diamante. Todos los derechos reservados.
        </div>
      </Container>
    </div>
  );
};

export default AcercaDe;
