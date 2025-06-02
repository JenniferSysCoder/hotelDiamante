import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../../serviciosAdicionales/Interfaces/IServicio";
import type { IReserva } from "../../Reservas/Interfaces/IReserva";
import type { ICliente } from "../../Clientes/Interfaces/ICliente";

const today = new Date().toISOString().split("T")[0];

const initialFactura: IFactura & { idCliente: number } = {
  idFactura: 0,
  fechaEmision: today,
  total: 0,
  idServicio: 0,
  idReserva: 0,
  nombreServicio: "",
  nombreCliente: "",
  numeroHabitacion: "",
  idCliente: 0,
};

export function EditarFactura() {
  const { id } = useParams<{ id: string }>();
  const [factura, setFactura] = useState(initialFactura);
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const reservasFiltradas = reservas.filter(
    (r) => r.idCliente === factura.idCliente
  );

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [facturaRes, serviciosRes, reservasRes, clientesRes] =
          await Promise.all([
            fetch(`${appsettings.apiUrl}Facturas/Obtener/${id}`),
            fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`),
            fetch(`${appsettings.apiUrl}Reservas/Lista`),
            fetch(`${appsettings.apiUrl}Clientes/Lista`),
          ]);

        if (
          !facturaRes.ok ||
          !serviciosRes.ok ||
          !reservasRes.ok ||
          !clientesRes.ok
        ) {
          throw new Error("Hubo un error al obtener los datos");
        }

        const facturaData = await facturaRes.json();
        const serviciosData = await serviciosRes.json();
        const reservasData = await reservasRes.json();
        const clientesData = await clientesRes.json();

        setServicios(serviciosData);
        setReservas(reservasData);
        setClientes(clientesData);

        // Buscar servicio, reserva y cliente para completar campos
        const servicioSeleccionado = serviciosData.find(
          (s: IServicio) => s.idServicio === facturaData.idServicio
        );
        const reservaSeleccionada = reservasData.find(
          (r: IReserva) => r.idReserva === facturaData.idReserva
        );
        const clienteSeleccionado = clientesData.find(
          (c: ICliente) => c.nombre === facturaData.nombreCliente
        );

        let idClienteEncontrado = 0;
        if (clienteSeleccionado) {
          idClienteEncontrado = clienteSeleccionado.idCliente;
        } else if (reservaSeleccionada) {
          idClienteEncontrado = reservaSeleccionada.idCliente;
        }

        setFactura({
          ...facturaData,
          nombreServicio: servicioSeleccionado?.nombre ?? "",
          nombreCliente:
            clienteSeleccionado?.nombre ??
            reservaSeleccionada?.nombreCliente ??
            "",
          numeroHabitacion: reservaSeleccionada?.numeroHabitacion ?? "",
          idCliente: idClienteEncontrado,
        });
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [id]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "idServicio") {
      const servicioSeleccionado = servicios.find(
        (s) => s.idServicio === Number(value)
      );
      setFactura((prev) => ({
        ...prev,
        idServicio: Number(value),
        nombreServicio: servicioSeleccionado?.nombre ?? "",
      }));
    } else if (name === "idCliente") {
      const clienteSeleccionado = clientes.find(
        (c) => c.idCliente === Number(value)
      );
      setFactura((prev) => ({
        ...prev,
        idCliente: Number(value),
        nombreCliente: clienteSeleccionado?.nombre ?? "",
        idReserva: 0,
        numeroHabitacion: "",
      }));
    } else if (name === "idReserva") {
      const reservaSeleccionada = reservas.find(
        (r) => r.idReserva === Number(value)
      );
      setFactura((prev) => ({
        ...prev,
        idReserva: Number(value),
        numeroHabitacion: reservaSeleccionada?.numeroHabitacion ?? "",
      }));
    } else {
      setFactura((prev) => ({
        ...prev,
        [name]: name === "total" ? Number(value) : value,
      }));
    }
  };

  const guardar = async () => {
    const response = await fetch(`${appsettings.apiUrl}Facturas/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    });

    if (response.ok) {
      Swal.fire("Actualizado", "Factura actualizada correctamente", "success");
      navigate("/facturas");
    } else {
      Swal.fire("Error", "No se pudo editar la factura", "error");
    }
  };

  const volver = () => {
    navigate("/facturas");
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Editar Factura</h4>
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
                <option value={0}>Seleccione un servicio</option>
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
                value={factura.idCliente}
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
              <Label>Reserva</Label>
              <Input
                type="select"
                name="idReserva"
                value={factura.idReserva}
                onChange={inputChangeValue}
                disabled={factura.idCliente === 0}
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
          <Button
            color="primary"
            className="me-4"
            onClick={guardar}
            disabled={
              factura.idServicio === 0 ||
              factura.idReserva === 0 ||
              !factura.fechaEmision
            }
          >
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
