import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Button,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../../Interfaces/IFactura";
import Swal from "sweetalert2";
import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaUser, FaConciergeBell, FaBed } from "react-icons/fa";

interface Props {
  idFactura: number;
  onClose: () => void;
}

export function VerDetallesFactura({ idFactura, onClose }: Props) {
  const [factura, setFactura] = useState<IFactura | null>(null);

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Facturas/Obtener/${idFactura}`);
        if (response.ok) {
          const data = await response.json();
          setFactura(data);
        } else {
          Swal.fire("Error", "No se pudo obtener la factura", "error");
          onClose();
        }
      } catch {
        Swal.fire("Error", "Error de conexión", "error");
        onClose();
      }
    };

    cargarFactura();
  }, [idFactura]);

  if (!factura) return null;

  return (
    <Modal isOpen centered size="md">
      <ModalHeader
        toggle={onClose}
        style={{
          backgroundColor: "#1976d2",
          color: "white",
          borderBottom: "none",
        }}
      >
        <FaFileInvoiceDollar className="me-2" />
        Detalles de Factura #{factura.idFactura}
      </ModalHeader>

      <ModalBody className="pt-4 pb-0">
        <Row className="mb-3">
          <Col xs="6">
            <div className="text-muted small">
              <FaCalendarAlt className="me-2 text-primary" />
              <strong>Fecha:</strong>
            </div>
            <div>{new Date(factura.fechaEmision).toLocaleDateString()}</div>
          </Col>
          <Col xs="6">
            <div className="text-muted small">
              <FaMoneyBillWave className="me-2 text-success" />
              <strong>Total:</strong>
            </div>
            <div className="fw-bold text-success">${factura.total.toFixed(2)}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs="12">
            <div className="text-muted small">
              <FaUser className="me-2 text-primary" />
              <strong>Cliente:</strong>
            </div>
            <div>{factura.nombreCliente}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs="12">
            <div className="text-muted small">
              <FaConciergeBell className="me-2 text-primary" />
              <strong>Servicio:</strong>
            </div>
            <div>{factura.nombreServicio}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs="12">
            <div className="text-muted small">
              <FaBed className="me-2 text-primary" />
              <strong>Habitación:</strong>
            </div>
            <div>{factura.numeroHabitacion}</div>
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button
          color="secondary"
          onClick={onClose}
          style={{
            borderRadius: "24px",
            fontWeight: "bold",
            padding: "6px 20px",
            boxShadow: "0 2px 6px #aaa",
          }}
        >
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
