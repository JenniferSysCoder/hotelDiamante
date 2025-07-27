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
import type { ILimpieza } from "../Interfaces/ILimpieza";
import type { IEmpleado } from "../../Empleados/Interfaces/IEmpleado";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion";
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

export function EditarLimpieza() {
  const { id } = useParams<{ id: string }>();
  const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [limpiezaRes, empleadosRes, habitacionesRes] = await Promise.all([
          fetch(`${appsettings.apiUrl}Limpiezas/Obtener/${id}`),
          fetch(`${appsettings.apiUrl}Empleados/Lista`),
          fetch(`${appsettings.apiUrl}Habitaciones/Lista`),
        ]);

        if (!limpiezaRes.ok || !empleadosRes.ok || !habitacionesRes.ok) {
          throw new Error("Hubo un error al obtener los datos");
        }

        const [limpiezaData, empleadosData, habitacionesData] =
          await Promise.all([
            limpiezaRes.json(),
            empleadosRes.json(),
            habitacionesRes.json(),
          ]);

        setLimpieza(limpiezaData);
        setEmpleados(empleadosData);
        setHabitaciones(habitacionesData);
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
      limpieza.fecha.trim() === "" ||
      limpieza.observaciones?.trim() === "" ||
      limpieza.idHabitacion === 0 ||
      limpieza.idEmpleado === 0
    ) {
      Swal.fire(
        "Error",
        "Por favor, complete todos los campos obligatorios.",
        "warning"
      );
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Limpiezas/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(limpieza),
    });

    if (response.ok) {
      Swal.fire("Actualizado", "Limpieza actualizada correctamente", "success");
      navigate("/limpiezas");
    } else {
      Swal.fire("Error", "No se pudo editar la limpieza", "error");
    }
  };

  const volver = () => {
    navigate("/limpiezas");
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
                  color: "#b71c1c",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                }}
              >
                <FaBroom size={28} />
                <h4 style={{ margin: 0 }}>Editar Limpieza</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Fecha
                      </Label>
                      <Input
                        type="date"
                        name="fecha"
                        value={limpieza.fecha}
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
                        Observaciones
                      </Label>
                      <Input
                        type="text"
                        name="observaciones"
                        value={limpieza.observaciones}
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
                        Habitación
                      </Label>
                      <Input
                        type="select"
                        name="idHabitacion"
                        value={limpieza.idHabitacion}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
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
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Empleado
                      </Label>
                      <Input
                        type="select"
                        name="idEmpleado"
                        value={limpieza.idEmpleado}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
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
