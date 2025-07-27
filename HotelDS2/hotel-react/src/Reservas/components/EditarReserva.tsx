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
import type { IReserva } from "../Interfaces/IReserva";
import type { ICliente } from "../../Clientes/Interfaces/ICliente";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion";
import { FaCalendarCheck, FaSave, FaArrowLeft } from "react-icons/fa";

const initialReserva: IReserva = {
  idReserva: 0,
  fechaInicio: "",
  fechaFin: "",
  estado: "",
  idCliente: 0,
  idHabitacion: 0,
};

export function EditarReserva() {
  const { id } = useParams<{ id: string }>();
  const [reserva, setReserva] = useState<IReserva>(initialReserva);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [resReserva, resClientes, resHabitaciones] = await Promise.all([
          fetch(`${appsettings.apiUrl}Reservas/Obtener/${id}`),
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
        } else {
          Swal.fire("Error", "No se pudo obtener la reserva", "error");
        }

        if (resClientes.ok) setClientes(await resClientes.json());
        if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
      } catch (error) {
        Swal.fire("Error", "Ocurrió un problema al cargar los datos", "error");
      }
    };

    obtenerDatos();
  }, [id]);

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReserva((prev) => ({
      ...prev,
      [name]:
        name === "idCliente" || name === "idHabitacion" ? Number(value) : value,
    }));
  };

  const guardar = async () => {
    if (
      !reserva.fechaInicio ||
      !reserva.fechaFin ||
      reserva.idCliente === 0 ||
      reserva.idHabitacion === 0 ||
      !reserva.estado
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (reserva.fechaFin < reserva.fechaInicio) {
      Swal.fire(
        "Fechas inválidas",
        "La fecha de fin no puede ser menor que la de inicio",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      const responseText = await response.text();
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { mensaje: responseText };
      }

      if (response.ok) {
        Swal.fire("Guardado", "Reserva actualizada correctamente", "success");
        navigate("/reservas");
      } else {
        Swal.fire(
          "Error",
          parsedResponse.mensaje || "No se pudo actualizar la reserva",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Hubo un problema con la solicitud. Intenta más tarde.",
        "error"
      );
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
                  color: "#b71c1c",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                }}
              >
                <FaCalendarCheck size={28} />
                <h4 style={{ margin: 0 }}>Editar Reserva</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Fecha Inicio
                      </Label>
                      <Input
                        type="date"
                        name="fechaInicio"
                        value={reserva.fechaInicio}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Fecha Fin
                      </Label>
                      <Input
                        type="date"
                        name="fechaFin"
                        value={reserva.fechaFin}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Estado
                      </Label>
                      <Input
                        type="select"
                        name="estado"
                        value={reserva.estado}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Cliente
                      </Label>
                      <Input
                        type="select"
                        name="idCliente"
                        value={reserva.idCliente}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
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
                  <Col md={12}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Habitación
                      </Label>
                      <Input
                        type="select"
                        name="idHabitacion"
                        value={reserva.idHabitacion}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      >
                        <option value={0}>Seleccione una habitación</option>
                        {habitaciones.map((h) => (
                          <option key={h.idHabitacion} value={h.idHabitacion}>
                            {h.numero}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button
                  color="danger"
                  className="me-2"
                  onClick={guardar}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #b71c1c22",
                    padding: "8px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaSave /> Guardar
                </Button>
                <Button
                  color="secondary"
                  onClick={volver}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #23272f22",
                    padding: "8px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
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
