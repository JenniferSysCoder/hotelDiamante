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
import type { IReserva } from "../../Interfaces/IReserva";
import Swal from "sweetalert2";

interface Props {
  idReserva: number;
  onClose: () => void;
}

export function VerDetalleReserva({ idReserva, onClose }: Props) {
  const [reserva, setReserva] = useState<IReserva | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${appsettings.apiUrl}Reservas/Obtener/${idReserva}`);
        if (res.ok) {
          const data = await res.json();
          setReserva(data);
        } else {
          Swal.fire("Error", "No se pudo cargar la reserva", "error");
          onClose();
        }
      } catch {
        Swal.fire("Error", "Error de conexión con el servidor", "error");
        onClose();
      }
    };

    cargar();
  }, [idReserva]);

  if (!reserva) return null;

  return (
    <Modal isOpen centered toggle={onClose} size="md">
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        Detalle de Reserva #{reserva.idReserva}
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col xs="6">
            <strong>Cliente:</strong>
            <div>{reserva.nombreCliente}</div>
          </Col>
          <Col xs="6">
            <strong>Habitación:</strong>
            <div>{reserva.numeroHabitacion}</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs="6">
            <strong>Fecha de Inicio:</strong>
            <div>{new Date(reserva.fechaInicio).toLocaleDateString()}</div>
          </Col>
          <Col xs="6">
            <strong>Fecha de Fin:</strong>
            <div>{new Date(reserva.fechaFin).toLocaleDateString()}</div>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <strong>Estado:</strong>
            <div>{reserva.estado}</div>
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
