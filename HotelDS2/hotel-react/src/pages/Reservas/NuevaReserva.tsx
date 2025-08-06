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
} from "reactstrap";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import type { IReserva } from "../../Interfaces/IReserva";
import type { ICliente } from "../../Interfaces/ICliente";
import type { IHabitacion } from "../../Interfaces/IHabitacion";
import { appsettings } from "../../settings/appsettings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const initialReserva: IReserva = {
  idReserva: 0,
  fechaInicio: "",
  fechaFin: "",
  estado: "Reservada",
  idCliente: 0,
  idHabitacion: 0,
  nombreCliente: "",
  numeroHabitacion: "",
};

export function NuevaReservaModal({ isOpen, onClose, onSave }: Props) {
  const [reserva, setReserva] = useState<IReserva>(initialReserva);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClientes = await fetch(`${appsettings.apiUrl}Clientes/Lista`);
        const resHabitaciones = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
        if (resClientes.ok) setClientes(await resClientes.json());
        if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar clientes o habitaciones", "error");
      }
    };

    if (isOpen) {
      setReserva(initialReserva);
      fetchData();
    }
  }, [isOpen]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReserva({
      ...reserva,
      [name]:
        name === "idCliente" || name === "idHabitacion" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      reserva.idCliente === 0 ||
      reserva.idHabitacion === 0 ||
      !reserva.fechaInicio ||
      !reserva.fechaFin
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (new Date(reserva.fechaInicio) > new Date(reserva.fechaFin)) {
      Swal.fire("Error", "La fecha de inicio no puede ser mayor que la fecha de fin", "error");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        // Encontrar el número de habitación seleccionada
        const habitacionSeleccionada = habitaciones.find(h => h.idHabitacion === reserva.idHabitacion);
        const clienteSeleccionado = clientes.find(c => c.idCliente === reserva.idCliente);
        
        // Disparar evento de notificación
        const evento = new CustomEvent("nueva-reserva", {
          detail: {
            numeroHabitacion: habitacionSeleccionada?.numero || "N/A",
            clienteNombre: clienteSeleccionado?.nombre || "Cliente",
          }
        });
        window.dispatchEvent(evento);
        
        await Swal.fire("Guardado", "Reserva creada correctamente", "success");
        onSave();     // ← Actualiza la lista
        onClose();    // ← Luego cierra el modal
      } else {
        let errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          Swal.fire("Error", errorData.mensaje || "No se pudo guardar la reserva", "error");
        } catch {
          Swal.fire("Error", errorText || "No se pudo guardar la reserva", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      console.error("Error al guardar reserva:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <FaCalendarPlus className="me-2 text-primary" />
        Nueva Reserva
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Cliente</Label>
            <Input
              type="select"
              name="idCliente"
              value={reserva.idCliente}
              onChange={inputChangeValue}
            >
              <option value={0}>Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Habitación</Label>
            <Input
              type="select"
              name="idHabitacion"
              value={reserva.idHabitacion}
              onChange={inputChangeValue}
            >
              <option value={0}>Seleccione una habitación</option>
              {habitaciones.map((habitacion) => (
                <option key={habitacion.idHabitacion} value={habitacion.idHabitacion}>
                  {habitacion.numero}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Fecha de inicio</Label>
            <Input
              type="date"
              name="fechaInicio"
              value={reserva.fechaInicio}
              onChange={inputChangeValue}
            />
          </FormGroup>

          <FormGroup>
            <Label>Fecha de fin</Label>
            <Input
              type="date"
              name="fechaFin"
              value={reserva.fechaFin}
              onChange={inputChangeValue}
            />
          </FormGroup>

          <FormGroup>
            <Label>Estado</Label>
            <Input
              type="select"
              name="estado"
              value={reserva.estado}
              disabled
              style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
            >
              <option value="Reservada">Reservada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Finalizada">Finalizada</option>
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
