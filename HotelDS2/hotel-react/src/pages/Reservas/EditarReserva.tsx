import { useEffect, useState, type ChangeEvent } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import { FaSave } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import type { IReserva } from "../../Interfaces/IReserva";
import type { ICliente } from "../../Interfaces/ICliente";
import type { IHabitacion } from "../../Interfaces/IHabitacion";

interface Props {
  isOpen: boolean;
  idReserva: number;
  onClose: () => void;
  onSave: () => void;
}

export function EditarReservaModal({ isOpen, idReserva, onClose, onSave }: Props) {
  const [reserva, setReserva] = useState<IReserva | null>(null);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resReserva, resClientes, resHabitaciones] = await Promise.all([
          fetch(`${appsettings.apiUrl}Reservas/Obtener/${idReserva}`),
          fetch(`${appsettings.apiUrl}Clientes/Lista`),
          fetch(`${appsettings.apiUrl}Habitaciones/Lista`),
        ]);

        if (resReserva.ok) {
          const data = await resReserva.json();
          setReserva({
            ...data,
            fechaInicio: data.fechaInicio?.split("T")[0] ?? "",
            fechaFin: data.fechaFin?.split("T")[0] ?? "",
          });
        }

        if (resClientes.ok) setClientes(await resClientes.json());
        if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
      } catch {
        Swal.fire("Error", "No se pudo cargar la reserva", "error");
        onClose();
      }
    };

    if (idReserva > 0 && isOpen) cargarDatos();
  }, [idReserva, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!reserva) return;
    const { name, value } = e.target;
    setReserva({
      ...reserva,
      [name]:
        name === "idCliente" || name === "idHabitacion"
          ? Number(value)
          : value,
    });
  };

  const guardar = async () => {
    if (!reserva) return;

    const { fechaInicio, fechaFin, idCliente, idHabitacion, estado } = reserva;
    if (!fechaInicio || !fechaFin || idCliente === 0 || idHabitacion === 0 || !estado) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (fechaFin < fechaInicio) {
      Swal.fire("Fechas inválidas", "La fecha de fin no puede ser menor que la de inicio", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        Swal.fire("Actualizado", "Reserva actualizada correctamente", "success");
        onSave();
        onClose();
      } else {
        const data = await response.json();
        Swal.fire("Error", data.mensaje || "No se pudo actualizar la reserva", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  if (!reserva) return null;

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <FaEdit className="me-2 text-primary" />
        Editar Reserva
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  name="fechaInicio"
                  value={reserva.fechaInicio}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  name="fechaFin"
                  value={reserva.fechaFin}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Estado</Label>
                <Input
                  type="select"
                  name="estado"
                  value={reserva.estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Reservada">Reservada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Finalizada">Finalizada</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Cliente</Label>
                <Input
                  type="select"
                  name="idCliente"
                  value={reserva.idCliente}
                  onChange={handleChange}
                >
                  <option value={0}>Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.idCliente} value={c.idCliente}>
                      {c.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Habitación</Label>
            <Input
              type="select"
              name="idHabitacion"
              value={reserva.idHabitacion}
              onChange={handleChange}
            >
              <option value={0}>Seleccione una habitación</option>
              {habitaciones.map((h) => (
                <option key={h.idHabitacion} value={h.idHabitacion}>
                  {h.numero}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar} className="fw-bold">
          <FaSave className="me-2" /> Guardar
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
