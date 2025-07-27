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
  Card,
  CardBody,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../../serviciosAdicionales/Interfaces/IServicio";
import type { IReserva } from "../../Reservas/Interfaces/IReserva";
import type { ICliente } from "../../Clientes/Interfaces/ICliente";
import { FaFileInvoiceDollar } from "react-icons/fa";

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
          <Card
            style={{
              borderRadius: "18px",
              boxShadow: "0 4px 24px #23272f33",
              border: "none",
              background: "linear-gradient(135deg, #f8fafc 80%, #e3e3e3 100%)",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                  color: "#b71c1c", // Mismo color que el botón Guardar
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                }}
              >
                <FaFileInvoiceDollar size={28} />
                <h4 style={{ margin: 0 }}>Editar Factura</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Fecha de Emisión</Label>
                      <Input
                        type="text"
                        name="fechaEmision"
                        value={factura.fechaEmision}
                        readOnly
                        disabled
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#f3f3f3",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Total</Label>
                      <Input
                        type="number"
                        name="total"
                        value={factura.total}
                        readOnly
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#f3f3f3",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Servicio</Label>
                      <Input
                        type="select"
                        name="idServicio"
                        value={factura.idServicio}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      >
                        <option value={0}>Seleccione un servicio</option>
                        {servicios.map((servicio) => (
                          <option key={servicio.idServicio} value={servicio.idServicio}>
                            {servicio.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Cliente</Label>
                      <Input
                        type="select"
                        name="idCliente"
                        value={factura.idCliente}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      >
                        <option value={0}>Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.idCliente} value={cliente.idCliente}>
                            {cliente.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Reserva</Label>
                      <Input
                        type="select"
                        name="idReserva"
                        value={factura.idReserva}
                        onChange={inputChangeValue}
                        disabled={factura.idCliente === 0}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      >
                        <option value={0}>Seleccione una reserva</option>
                        {reservasFiltradas.map((reserva) => (
                          <option key={reserva.idReserva} value={reserva.idReserva}>
                            {`Reserva #${reserva.idReserva} - Hab: ${reserva.numeroHabitacion}`}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Habitación</Label>
                      <Input
                        type="text"
                        name="numeroHabitacion"
                        value={factura.numeroHabitacion}
                        readOnly
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#f3f3f3",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button
                  color="danger"
                  onClick={guardar}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #b71c1c22",
                    padding: "8px 24px",
                  }}
                  disabled={
                    factura.idServicio === 0 ||
                    factura.idReserva === 0 ||
                    !factura.fechaEmision
                  }
                >
                  Guardar
                </Button>
                <Button
                  color="secondary"
                  onClick={volver}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #23272f22",
                    padding: "8px 24px",
                  }}
                >
                  Volver
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}