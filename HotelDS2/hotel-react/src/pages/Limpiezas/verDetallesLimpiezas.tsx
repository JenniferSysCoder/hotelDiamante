import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import type { ILimpieza } from "../../Interfaces/ILimpieza";

interface Props {
  idLimpieza: number;
  onClose: () => void;
}

export function VerDetalleLimpieza({ idLimpieza, onClose }: Props) {
  const [limpieza, setLimpieza] = useState<ILimpieza | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Limpiezas/Obtener/${idLimpieza}`);
        if (response.ok) {
          const data = await response.json();
          setLimpieza(data);
        } else {
          Swal.fire("Error", "No se pudo obtener la limpieza", "error");
          onClose();
        }
      } catch {
        Swal.fire("Error", "Hubo un problema de conexión", "error");
        onClose();
      } finally {
        setCargando(false);
      }
    };

    if (idLimpieza > 0) {
      fetchDetalle();
    }
  }, [idLimpieza]);

  return (
    <Modal isOpen={true} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        Detalles de Limpieza
      </ModalHeader>
      <ModalBody>
        {cargando ? (
          <div className="text-center my-4">
            <Spinner color="danger" />
          </div>
        ) : (
          <>
            <Row className="mb-2">
              <Col xs={5} className="fw-bold text-muted">Fecha:</Col>
              <Col xs={7}>{limpieza?.fecha ? new Date(limpieza.fecha).toLocaleDateString() : "N/D"}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={5} className="fw-bold text-muted">Empleado:</Col>
              <Col xs={7}>{limpieza?.nombreEmpleado || "N/D"}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={5} className="fw-bold text-muted">Habitación:</Col>
              <Col xs={7}>{limpieza?.numeroHabitacion || "N/D"}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={5} className="fw-bold text-muted">Observaciones:</Col>
              <Col xs={7}>{limpieza?.observaciones || "Sin observaciones"}</Col>
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}
