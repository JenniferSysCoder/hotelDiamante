import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IHabitacion } from "../Interfaces/IHabitacion";
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
import { FaBed, FaSave, FaArrowLeft } from "react-icons/fa";

const initialHabitacion: IHabitacion = {
  numero: "",
  tipo: "",
  precioNoche: 0,
  estado: "Disponible",
  idHotel: 0,
  idHabitacion: 0,
  nombreHotel: "",
};

export function NuevaHabitacion() {
  const [habitacion, setHabitacion] = useState<IHabitacion>(initialHabitacion);
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
    setHabitacion({
      ...habitacion,
      [name]:
        name === "precioNoche" || name === "idHotel" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (habitacion.idHotel === 0) {
      Swal.fire("Faltan datos", "Seleccione un hotel", "warning");
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Habitaciones/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitacion),
    });

    if (response.ok) {
      Swal.fire("Guardado", "Habitación creada correctamente", "success");
      navigate("/habitaciones");
    } else {
      const errorData = await response.json();
      Swal.fire(
        "Error",
        errorData.mensaje || "No se pudo guardar la habitación",
        "error"
      );
    }
  };

  const volver = () => {
    navigate("/habitaciones");
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
                <FaBed size={22} color="#b71c1c" />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nueva Habitación
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#333" }}>
                        Número
                      </Label>
                      <Input
                        type="text"
                        name="numero"
                        value={habitacion.numero}
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
                        Tipo
                      </Label>
                      <Input
                        type="text"
                        name="tipo"
                        value={habitacion.tipo}
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
                        Precio por noche
                      </Label>
                      <Input
                        type="number"
                        name="precioNoche"
                        value={habitacion.precioNoche}
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
                        Estado
                      </Label>
                      <Input
                        type="text"
                        name="estado"
                        value={habitacion.estado}
                        disabled
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#f3f4f6",
                          color: "#6b7280",
                          border: "1px solid #d1d5db",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>
                    Hotel
                  </Label>
                  <Input
                    type="select"
                    name="idHotel"
                    value={habitacion.idHotel}
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
