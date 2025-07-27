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
  Card,
  CardBody,
} from "reactstrap";
import { FaSave, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";

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
      try {
        const resClientes = await fetch(`${appsettings.apiUrl}Clientes/Lista`);
        const resHabitaciones = await fetch(
          `${appsettings.apiUrl}Habitaciones/Lista`
        );
        if (resClientes.ok) setClientes(await resClientes.json());
        if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo cargar la información de clientes o habitaciones",
          "error"
        );
      }
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
          <Card
            style={{
              borderRadius: "14px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                  color: "#b71c1c",
                }}
              >
                <FaCalendarAlt size={22} />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nueva Reserva
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="idCliente"
                  >
                    Cliente
                  </Label>
                  <Input
                    type="select"
                    name="idCliente"
                    id="idCliente"
                    value={reserva.idCliente}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
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

                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="idHabitacion"
                  >
                    Habitación
                  </Label>
                  <Input
                    type="select"
                    name="idHabitacion"
                    id="idHabitacion"
                    value={reserva.idHabitacion}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value={0}>Seleccione una habitación</option>
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
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="fechaInicio"
                  >
                    Fecha de inicio
                  </Label>
                  <Input
                    type="date"
                    name="fechaInicio"
                    id="fechaInicio"
                    value={reserva.fechaInicio}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="fechaFin"
                  >
                    Fecha de fin
                  </Label>
                  <Input
                    type="date"
                    name="fechaFin"
                    id="fechaFin"
                    value={reserva.fechaFin}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="estado"
                  >
                    Estado
                  </Label>
                  <Input
                    type="select"
                    name="estado"
                    id="estado"
                    value={reserva.estado}
                    disabled
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                    }}
                  >
                    <option value="Reservada">Reservada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Finalizada">Finalizada</option>
                  </Input>
                </FormGroup>
              </Form>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={guardar}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#b71c1c",
                    border: "none",
                    padding: "10px 18px",
                    fontWeight: "600",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaSave /> Guardar
                </Button>
                <Button
                  onClick={volver}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#6b7280",
                    border: "none",
                    padding: "10px 18px",
                    fontWeight: "600",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaArrowLeft /> Volver
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
