import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Button } from "reactstrap";
import type { IServicio } from "../../Interfaces/IServicio";

interface Props {
  isOpen: boolean;
  servicio: IServicio;
  onClose: () => void;
}

export function VerDetalleServicio({ isOpen, servicio, onClose }: Props) {
  if (!servicio) return null;

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader
        toggle={onClose}
        className="bg-primary text-white"
        style={{ borderBottom: "none" }}
      >
        Detalles del Servicio
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col xs="6">
            <strong className="text-muted">ID:</strong>
            <div className="fw-bold">{servicio.idServicio}</div>
          </Col>
          <Col xs="6">
            <strong className="text-muted">Nombre:</strong>
            <div className="fw-bold text-primary">{servicio.nombre}</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs="12">
            <strong className="text-muted">Descripción:</strong>
            <div>{servicio.descripcion || <span className="text-muted">N/A</span>}</div>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <strong className="text-muted">Precio:</strong>
            <div className="fw-bold text-success">${servicio.precio.toFixed(2)}</div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
