import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import type { IPago } from "../../Interfaces/IPago";

interface VerDetallePagoProps {
  idPago: number;
  onClose: () => void;
}

export function VerDetallePago({ idPago, onClose }: VerDetallePagoProps) {
  const [pago, setPago] = useState<IPago | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPago = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Pagos/Obtener/${idPago}`);
        if (!response.ok) throw new Error("No se pudo obtener el pago");
        const data = await response.json();
        setPago(data);
      } catch (error) {
        Swal.fire("Error", "Error al obtener detalles del pago", "error");
      } finally {
        setCargando(false);
      }
    };

    if (idPago) obtenerPago();
  }, [idPago]);

  return (
    <Modal isOpen={true} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        Detalle del Pago
      </ModalHeader>
      <ModalBody>
        {cargando ? (
          <div className="text-center my-4">
            <Spinner color="danger" />
          </div>
        ) : pago ? (
          <div className="px-3">
            <Row className="mb-3">
              <Col md={6}>
                <strong className="text-muted">Fecha de Pago:</strong>
                <div>{new Date(pago.fechaPago).toLocaleDateString()}</div>
              </Col>
              <Col md={6}>
                <strong className="text-muted">Método de Pago:</strong>
                <div>{pago.metodoPago}</div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong className="text-muted">Monto:</strong>
                <div className="fw-bold text-success">${pago.monto.toFixed(2)}</div>
              </Col>
              <Col md={6}>
                <strong className="text-muted">Factura Asociada:</strong>
                <div>
                  #{pago.idFactura} - {pago.nombreCliente}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <strong className="text-muted">Número Habitación Factura:</strong>
                <div>{pago.numeroFacturaHabitacion || "N/D"}</div>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="text-center text-muted">No se encontraron datos del pago.</div>
        )}
        <div className="text-end mt-4">
          <Button color="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
