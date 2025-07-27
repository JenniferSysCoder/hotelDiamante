import { type ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { IServicio } from "../Interfaces/IServicio";
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
import { FaConciergeBell, FaSave, FaArrowLeft } from "react-icons/fa";

const initialServicio: IServicio = {
  idServicio: 0,
  nombre: "",
  descripcion: "",
  precio: 0,
};

export function EditarServicios() {
  const { id } = useParams<{ id: string }>();
  const [servicio, setServicio] = useState<IServicio>(initialServicio);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerServicio = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}ServiciosAdicionales/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setServicio(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el servicio", "error");
      }
    };

    obtenerServicio();
  }, [id]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setServicio({ ...servicio, [inputName]: inputName === "precio" ? Number(inputValue) : inputValue });
  };

  const guardar = async () => {
    // Validaciones
    if (!servicio.nombre.trim()) {
      Swal.fire("Faltan datos", "El nombre es obligatorio", "warning");
      return;
    }
    if (!servicio.descripcion?.trim()) {
      Swal.fire("Faltan datos", "La descripción es obligatoria", "warning");
      return;
    }
    if (servicio.precio <= 0) {
      Swal.fire("Faltan datos", "El precio debe ser mayor a cero", "warning");
      return;
    }

    const response = await fetch(
      `${appsettings.apiUrl}ServiciosAdicionales/Editar`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicio),
      }
    );

    const data = await response.json();

    if (response.ok) {
      await Swal.fire("Éxito", data.mensaje, "success");
      navigate("/servicios");
    } else {
      Swal.fire(
        "Error",
        data.mensaje || "No se pudo editar el servicio",
        "error"
      );
    }
  };

  const volver = () => {
    navigate("/servicios");
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
                <FaConciergeBell size={28} />
                <h4 style={{ margin: 0 }}>Editar Servicio</h4>
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
                        onChange={inputChangeValue}
                        value={servicio.nombre}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Descripción</Label>
                      <Input
                        type="text"
                        name="descripcion"
                        onChange={inputChangeValue}
                        value={servicio.descripcion}
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Precio</Label>
                      <Input
                        type="number"
                        name="precio"
                        onChange={inputChangeValue}
                        value={servicio.precio}
                        min="0"
                        step="0.01"
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
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
