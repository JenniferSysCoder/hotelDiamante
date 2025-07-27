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
import type { IHabitacion } from "../Interfaces/IHabitacion";
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

export function EditarHabitacion() {
  const { id } = useParams<{ id: string }>();
  const [habitacion, setHabitacion] = useState<IHabitacion>(initialHabitacion);
  const [hoteles, setHoteles] = useState<{ idHotel: number; nombre: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerHabitacion = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}Habitaciones/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setHabitacion(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la habitación", "error");
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

    obtenerHabitacion();
    obtenerHoteles();
  }, [id]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setHabitacion({
      ...habitacion,
      [name]:
        name === "precioNoche" || name === "idHotel" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      !habitacion.numero.trim() ||
      !habitacion.tipo.trim() ||
      habitacion.precioNoche <= 0 ||
      habitacion.idHotel <= 0
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor completa todos los campos obligatorios correctamente",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Habitaciones/Editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habitacion),
      });

      if (response.ok) {
        Swal.fire(
          "Actualizado",
          "Habitación actualizada correctamente",
          "success"
        );
        navigate("/habitaciones");
      } else {
        Swal.fire("Error", "No se pudo editar la habitación", "error");
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
    navigate("/habitaciones");
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
                  color: "#b71c1c", // Mismo color rojo que el botón Guardar
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                }}
              >
                <FaBed size={28} />
                <h4 style={{ margin: 0 }}>Editar Habitación</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Número</Label>
                      <Input
                        type="text"
                        name="numero"
                        value={habitacion.numero}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Tipo</Label>
                      <Input
                        type="text"
                        name="tipo"
                        value={habitacion.tipo}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Precio por noche</Label>
                      <Input
                        type="number"
                        name="precioNoche"
                        value={habitacion.precioNoche}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Estado</Label>
                      <Input
                        type="text"
                        name="estado"
                        value={habitacion.estado}
                        disabled
                        style={{
                          borderRadius: "12px",
                          background: "#f5f5f5",
                          color: "#888",
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
                        value={habitacion.idHotel}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
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