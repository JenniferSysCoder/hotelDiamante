import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../../serviciosAdicionales/Interfaces/IServicio";
import type { IReserva } from "../../Reservas/Interfaces/IReserva";
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

const today = new Date().toISOString().split("T")[0];

const initialFactura: IFactura = {
  idFactura: 0,
  fechaEmision: today,
  total: 0,
  idServicio: 0,
  idReserva: 0,
  nombreServicio: "",
  nombreCliente: "",
  numeroHabitacion: "",
};

export function NuevaFactura() {
  const [factura, setFactura] = useState<IFactura>(initialFactura);
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [clientes, setClientes] = useState<
    { idCliente: number; nombreCliente: string }[]
  >([]);
  const [reservasFiltradas, setReservasFiltradas] = useState<IReserva[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}ServiciosAdicionales/Lista`
        );
        const data = await response.json();
        if (Array.isArray(data)) setServicios(data);
        else Swal.fire("Error", "Formato de servicios incorrecto", "error");
      } catch (error) {
        console.error("Error servicios:", error);
        Swal.fire("Error", "Error al cargar servicios", "error");
      }
    };

    const fetchReservas = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Reservas/Lista`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setReservas(data);
          
          const clientesUnicos = data.reduce(
            (acc: { idCliente: number; nombreCliente: string }[], reserva) => {
              if (!acc.some((c) => c.idCliente === reserva.idCliente)) {
                acc.push({
                  idCliente: reserva.idCliente,
                  nombreCliente: reserva.nombreCliente,
                });
              }
              return acc;
            },
            []
          );
          setClientes(clientesUnicos);
        } else {
          Swal.fire("Error", "Formato de reservas incorrecto", "error");
        }
      } catch (error) {
        console.error("Error reservas:", error);
        Swal.fire("Error", "Error al cargar reservas", "error");
      }
    };

    fetchServicios();
    fetchReservas();
  }, []);

  const calcularTotal = async (idReserva: number, idServicio: number) => {
    if (idReserva > 0 && idServicio > 0) {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Facturas/CalcularTotal?idReserva=${idReserva}&idServicio=${idServicio}`
        );
        if (response.ok) {
          const data = await response.json();
          setFactura((prev) => ({
            ...prev,
            total: data.totalCalculado,
          }));
        } else {
        }
      } catch (error) {
        console.error("Error al calcular total:", error);
      }
    }
  };

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "idCliente") {
      const idCliente = Number(value);
      const reservasCliente = reservas.filter((r) => r.idCliente === idCliente);
      setReservasFiltradas(reservasCliente);

      setFactura((prev) => ({
        ...prev,
        idReserva: 0,
        numeroHabitacion: "",
        nombreCliente:
          clientes.find((c) => c.idCliente === idCliente)?.nombreCliente ?? "",
      }));
      return;
    }

    const numericValue =
      name === "idServicio" || name === "idReserva" ? Number(value) : value;

    let updatedFactura = {
      ...factura,
      [name]: numericValue,
    };

    if (name === "idReserva") {
      const reservaSeleccionada = reservas.find(
        (r) => r.idReserva === numericValue
      );
      updatedFactura.numeroHabitacion =
        reservaSeleccionada?.numeroHabitacion ?? "";
      updatedFactura.nombreCliente = reservaSeleccionada?.nombreCliente ?? "";
    }

    setFactura(updatedFactura);

    if (
      (name === "idServicio" && updatedFactura.idReserva > 0) ||
      (name === "idReserva" && updatedFactura.idServicio > 0)
    ) {
      calcularTotal(updatedFactura.idReserva, updatedFactura.idServicio);
    }
  };

  const guardar = async () => {
    if (
      factura.idServicio === 0 ||
      factura.idReserva === 0 ||
      !factura.fechaEmision
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor, complete todos los campos",
        "warning"
      );
      return;
    }

    if (!factura.numeroHabitacion || factura.numeroHabitacion.trim() === "") {
      Swal.fire(
        "Error",
        "La habitación asociada a la reserva no es válida",
        "warning"
      );
      return;
    }

    const facturaData = {
      fechaEmision: factura.fechaEmision,
      total: factura.total,
      idServicio: factura.idServicio,
      idReserva: factura.idReserva,
      numeroHabitacion: factura.numeroHabitacion,
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}Facturas/Nueva`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facturaData),
      });

      if (response.ok) {
        Swal.fire("Guardado", "Factura registrada correctamente", "success");
        navigate("/facturas");
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          Swal.fire(
            "Error",
            errorData.mensaje || "No se pudo guardar la factura",
            "error"
          );
        } catch {
          Swal.fire("Error", "Error desconocido: " + errorText, "error");
        }
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire("Error", "Hubo un problema al enviar la solicitud", "error");
    }
  };

  const volver = () => {
    navigate("/facturas");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Nueva Factura</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Fecha de Emisión</Label>
              <Input
                type="text"
                name="fechaEmision"
                value={factura.fechaEmision}
                readOnly
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>Total</Label>
              <Input
                type="number"
                name="total"
                value={factura.total}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label>Servicio</Label>
              <Input
                type="select"
                name="idServicio"
                value={factura.idServicio}
                onChange={inputChangeValue}
              >
                <option value="0">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.idServicio} value={servicio.idServicio}>
                    {servicio.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Cliente</Label>
              <Input
                type="select"
                name="idCliente"
                value={
                  clientes.find(
                    (c) => c.nombreCliente === factura.nombreCliente
                  )?.idCliente || 0
                }
                onChange={inputChangeValue}
              >
                <option value={0}>Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.idCliente} value={cliente.idCliente}>
                    {cliente.nombreCliente}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Reserva</Label>
              <Input
                type="select"
                name="idReserva"
                value={factura.idReserva}
                onChange={inputChangeValue}
                disabled={factura.nombreCliente === ""}
              >
                <option value={0}>Seleccione una reserva</option>
                {reservasFiltradas.map((reserva) => (
                  <option key={reserva.idReserva} value={reserva.idReserva}>
                    {`Reserva #${reserva.idReserva} - Hab: ${reserva.numeroHabitacion}`}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Habitación</Label>
              <Input
                type="text"
                name="numeroHabitacion"
                value={factura.numeroHabitacion}
                readOnly
              />
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
