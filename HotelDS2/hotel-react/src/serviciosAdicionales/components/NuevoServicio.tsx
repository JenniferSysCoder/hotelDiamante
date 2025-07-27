import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
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
import { FaSave, FaArrowLeft, FaConciergeBell } from "react-icons/fa";

const initialServicio: IServicio = {
  idServicio: 0,
  nombre: "",
  descripcion: "",
  precio: 0,
};

export function NuevoServicio() {
  const [servicio, setServicio] = useState<IServicio>(initialServicio);
  const navigate = useNavigate();

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue =
      inputName === "precio" ? Number(event.target.value) : event.target.value;

    setServicio({ ...servicio, [inputName]: inputValue });
  };

  const guardar = async () => {
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

    try {
      const response = await fetch(
        `${appsettings.apiUrl}ServiciosAdicionales/Nuevo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(servicio),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await Swal.fire(
          "¡Guardado!",
          "El servicio se guardó correctamente.",
          "success"
        );
        navigate("/servicios");
      } else {
        Swal.fire(
          "Error",
          data.mensaje || "No se pudo guardar el servicio",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al conectar con el servidor",
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
                <FaConciergeBell size={22} />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nuevo Servicio
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="nombre"
                  >
                    Nombre
                  </Label>
                  <Input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={servicio.nombre}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                    placeholder="Nombre del servicio"
                  />
                </FormGroup>
                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="descripcion"
                  >
                    Descripción
                  </Label>
                  <Input
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    value={servicio.descripcion}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                    placeholder="Descripción breve"
                  />
                </FormGroup>
                <FormGroup>
                  <Label
                    style={{ fontWeight: "bold", color: "#333" }}
                    htmlFor="precio"
                  >
                    Precio
                  </Label>
                  <Input
                    type="number"
                    name="precio"
                    id="precio"
                    value={servicio.precio}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
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
