import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { ILimpieza } from "../Interfaces/ILimpieza";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion";
import type { IEmpleado } from "../../Empleados/Interfaces/IEmpleado";
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
import { FaBroom, FaSave, FaArrowLeft } from "react-icons/fa";

const initialLimpieza: ILimpieza = {
  fecha: "",
  observaciones: "",
  idHabitacion: 0,
  idEmpleado: 0,
  idLimpieza: 0,
  nombreEmpleado: "",
  numeroHabitacion: "",
};

export function NuevaLimpieza() {
  const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const response = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
      }
    };
    const fetchHabitaciones = async () => {
      const response = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data);
      }
    };
    fetchEmpleados();
    fetchHabitaciones();
  }, []);

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLimpieza({
      ...limpieza,
      [name]:
        name === "idHabitacion" || name === "idEmpleado"
          ? Number(value)
          : value,
    });
  };

  const guardar = async () => {
    if (
      limpieza.idHabitacion === 0 ||
      limpieza.idEmpleado === 0 ||
      !limpieza.fecha
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor, complete todos los campos",
        "warning"
      );
      return;
    }

    const empleadoSeleccionado = empleados.find(
      (empleado) => empleado.idEmpleado === limpieza.idEmpleado
    );
    const habitacionSeleccionada = habitaciones.find(
      (habitacion) => habitacion.idHabitacion === limpieza.idHabitacion
    );

    const limpiezaData = {
      Fecha: limpieza.fecha,
      Observaciones: limpieza.observaciones,
      IdEmpleado: limpieza.idEmpleado,
      NombreEmpleado: empleadoSeleccionado?.nombre || "",
      IdHabitacion: limpieza.idHabitacion,
      NumeroHabitacion: habitacionSeleccionada?.numero || "",
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}Limpiezas/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(limpiezaData),
      });

      if (response.ok) {
        Swal.fire("Guardado", "Limpieza registrada correctamente", "success");
        navigate("/limpiezas");
      } else {
        const errorText = await response.text();
        console.error("Error al guardar:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          Swal.fire(
            "Error",
            errorData.mensaje || "No se pudo guardar la limpieza",
            "error"
          );
        } catch (e) {
          Swal.fire("Error", "Error desconocido: " + errorText, "error");
        }
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire("Error", "Hubo un problema al enviar la solicitud", "error");
    }
  };

  const volver = () => {
    navigate("/limpiezas");
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
                <FaBroom size={22} />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nueva Limpieza
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#333" }}>
                        Fecha
                      </Label>
                      <Input
                        type="date"
                        name="fecha"
                        value={limpieza.fecha}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#fff",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#333" }}>
                        Observaciones
                      </Label>
                      <Input
                        type="text"
                        name="observaciones"
                        value={limpieza.observaciones}
                        onChange={inputChangeValue}
                        placeholder="Opcional"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#fff",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>
                    Habitación
                  </Label>
                  <Input
                    type="select"
                    name="idHabitacion"
                    value={limpieza.idHabitacion}
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
                  <Label style={{ fontWeight: "bold", color: "#333" }}>
                    Empleado
                  </Label>
                  <Input
                    type="select"
                    name="idEmpleado"
                    value={limpieza.idEmpleado}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value={0}>Seleccione un empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                        {empleado.nombre}
                      </option>
                    ))}
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
