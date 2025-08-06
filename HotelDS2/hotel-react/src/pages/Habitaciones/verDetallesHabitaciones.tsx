// src/Habitaciones/verDetalleHabitaciones.tsx
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FaBed, FaDollarSign, FaHotel, FaInfoCircle } from "react-icons/fa";
import type { IHabitacion } from "../../Interfaces/IHabitacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  habitacion: IHabitacion | null;
}

export function VerDetalleHabitaciones({ isOpen, onClose, habitacion }: Props) {
  if (!habitacion) return null;

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose} style={{ backgroundColor: "#1976d2", color: "#fff" }}>
        <FaInfoCircle className="me-2" />
        Detalle de Habitación
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#f8f9fa" }}>
        <ListGroup flush>
          <ListGroupItem>
            <Row>
              <Col md={4} className="fw-bold">
                <FaBed className="me-2 text-primary" />
                Número:
              </Col>
              <Col md={8}>{habitacion.numero}</Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              <Col md={4} className="fw-bold">
                <FaInfoCircle className="me-2 text-primary" />
                Tipo:
              </Col>
              <Col md={8}>{habitacion.tipo}</Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              <Col md={4} className="fw-bold">
                <FaDollarSign className="me-2 text-success" />
                Precio:
              </Col>
              <Col md={8}>${habitacion.precioNoche.toFixed(2)}</Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              <Col md={4} className="fw-bold">
                <FaInfoCircle className="me-2 text-secondary" />
                Estado:
              </Col>
              <Col md={8}>{habitacion.estado}</Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              <Col md={4} className="fw-bold">
                <FaHotel className="me-2 text-primary" />
                Hotel:
              </Col>
              <Col md={8}>{habitacion.nombreHotel}</Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}
