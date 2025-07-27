import { useState, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IEmpleado } from "../Interfaces/IEmpleado";
import type { IHotel } from "../../Hotel/Interfaces/IHotel";
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
import { FaUserTie, FaSave, FaArrowLeft } from "react-icons/fa";

const initialEmpleado: IEmpleado = {
  idEmpleado: 0,
  nombre: "",
  apellido: "",
  cargo: "",
  telefono: "",
  idHotel: 0,
};

export function NuevoEmpleado() {
  const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHoteles = async () => {
      const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      }
    };
    fetchHoteles();
  }, []);

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
      !empleado.idHotel
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    const empleadoConHotel = {
      ...empleado,
      NombreHotel: hoteles.find((hotel) => hotel.idHotel === empleado.idHotel)
        ?.nombre,
    };

    const response = await fetch(`${appsettings.apiUrl}Empleados/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleadoConHotel),
    });

    if (response.ok) {
      Swal.fire("Guardado", "Empleado creado correctamente", "success");
      navigate("/empleados");
    } else {
      const errorData = await response.json();
      Swal.fire(
        "Error",
        errorData.mensaje || "No se pudo guardar el empleado",
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
                }}
              >
                <FaUserTie size={22} color="#b71c1c" />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nuevo Empleado
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#333" }}>
                        Nombre
                      </Label>
                      <Input
                        type="text"
                        name="nombre"
                        value={empleado.nombre}
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
                        Apellido
                      </Label>
                      <Input
                        type="text"
                        name="apellido"
                        value={empleado.apellido}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#fff",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#333" }}>
                        Cargo
                      </Label>
                      <Input
                        type="text"
                        name="cargo"
                        value={empleado.cargo}
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
                        Teléfono
                      </Label>
                      <Input
                        type="text"
                        name="telefono"
                        value={empleado.telefono}
                        onChange={inputChangeValue}
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
                  <Label style={{ fontWeight: "bold", color: "#333" }}>Hotel</Label>
                  <Input
                    type="select"
                    name="idHotel"
                    value={empleado.idHotel}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="0">Seleccione un hotel</option>
                    {hoteles.map((hotel) => (
                      <option key={hotel.idHotel} value={hotel.idHotel}>
                        {hotel.nombre}
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
