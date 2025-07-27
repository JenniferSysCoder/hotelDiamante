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
import type { IEmpleado } from "../Interfaces/IEmpleado";
import type { IHotel } from "../../Hotel/Interfaces/IHotel";
import { FaUserEdit } from "react-icons/fa";

const initialEmpleado: IEmpleado = {
  idEmpleado: 0,
  nombre: "",
  apellido: "",
  cargo: "",
  telefono: "",
  idHotel: 0,
  nombreHotel: "",
};

export function EditarEmpleado() {
  const { id } = useParams<{ id: string }>();
  const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpleado = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}Empleados/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmpleado(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el empleado", "error");
      }
    };

    const obtenerHoteles = async () => {
      const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      } else {
        Swal.fire("Error", "No se pudieron cargar los hoteles", "error");
      }
    };

    obtenerEmpleado();
    obtenerHoteles();
  }, [id]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEmpleado({
      ...empleado,
      [name]: name === "idHotel" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      !empleado.nombre.trim() ||
      !empleado.apellido.trim() ||
      !empleado.cargo.trim() ||
      !empleado.telefono?.trim() ||
      empleado.idHotel === 0
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor completa todos los campos obligatorios",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(
        `${appsettings.apiUrl}Empleados/Editar/${empleado.idEmpleado}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empleado),
        }
      );

      if (response.ok) {
        Swal.fire("Guardado", "Empleado actualizado correctamente", "success");
        navigate("/empleados");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.mensaje || "No se pudo actualizar el empleado",
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
    navigate("/empleados");
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
                <FaUserEdit size={28} />
                <h4 style={{ margin: 0 }}>Editar Empleado</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Nombre</Label>
                      <Input
                        type="text"
                        name="nombre"
                        value={empleado.nombre}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Apellido</Label>
                      <Input
                        type="text"
                        name="apellido"
                        value={empleado.apellido}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Cargo</Label>
                      <Input
                        type="text"
                        name="cargo"
                        value={empleado.cargo}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Teléfono</Label>
                      <Input
                        type="text"
                        name="telefono"
                        value={empleado.telefono}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Hotel</Label>
                      <Input
                        type="select"
                        name="idHotel"
                        value={empleado.idHotel}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #1976d211",
                        }}
                      >
                        <option value={0}>Seleccione un hotel</option>
                        {hoteles.map((hotel) => (
                          <option key={hotel.idHotel} value={hotel.idHotel}>
                            {hotel.nombre}
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
                  onClick={guardar}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #b71c1c22",
                    padding: "8px 24px",
                  }}
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