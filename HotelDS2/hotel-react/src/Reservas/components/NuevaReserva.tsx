import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IReserva } from "../Interfaces/IReserva";
import type { ICliente } from "../../Clientes/Interfaces/ICliente";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

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

export function NuevaReserva() {
  const [reserva, setReserva] = useState<IReserva>(initialReserva);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const resClientes = await fetch(`${appsettings.apiUrl}Clientes/Lista`);
      const resHabitaciones = await fetch(
        `${appsettings.apiUrl}Habitaciones/Lista`
      );
      if (resClientes.ok) setClientes(await resClientes.json());
      if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
    };
    fetchData();
  }, []);
  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      Swal.fire(
        "Error",
        "La fecha de inicio no puede ser mayor que la fecha de fin",
        "error"
      );
      return;
    }

    console.log("Enviando reserva:", reserva);

    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        Swal.fire("Guardado", "Reserva creada correctamente", "success");
        window.dispatchEvent(
          new CustomEvent("nueva-reserva", {
            detail: { numeroHabitacion: reserva.idHabitacion },
          })
        );
        navigate("/reservas");
      } else {
        let errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          Swal.fire(
            "Error",
            errorData.mensaje || "No se pudo guardar la reserva",
            "error"
          );
        } catch {
          Swal.fire(
            "Error",
            errorText || "No se pudo guardar la reserva",
            "error"
          );
        }
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      console.error("Error al guardar reserva:", error);
    }
  };
  const volver = () => {
    navigate("/reservas");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Nueva Reserva</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Cliente</Label>
              <Input
                type="select"
                name="idCliente"
                value={reserva.idCliente}
                onChange={inputChangeValue}
              >
                <option value="0">Seleccione un cliente</option>
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
                <option value="0">Seleccione una habitación</option>
                {habitaciones.map((habitacion) => (
                  <option
                    key={habitacion.idHabitacion}
                    value={habitacion.idHabitacion}
                  >
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
              >
                <option value="Reservada">Reservada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Finalizada">Finalizada</option>
              </Input>
            </FormGroup>
          </Form>
          <Button color="primary" className="me-4" onClick={guardar}>
            Guardar
          </Button>
          <Button color="secondary" onClick={volver}>
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
