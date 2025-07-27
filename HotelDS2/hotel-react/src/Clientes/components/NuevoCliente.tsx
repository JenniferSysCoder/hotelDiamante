import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { ICliente } from "../Interfaces/ICliente";
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
import { FaUser, FaSave, FaArrowLeft } from "react-icons/fa";

const initialCliente: ICliente = {
  idCliente: 0,
  nombre: "",
  apellido: "",
  documento: "",
  correo: "",
  telefono: "",
};

export function NuevoCliente() {
  const [cliente, setCliente] = useState<ICliente>(initialCliente);
  const navigate = useNavigate();

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const guardar = async () => {
    if (
      !cliente.nombre.trim() ||
      !cliente.apellido.trim() ||
      !cliente.documento.trim() ||
      !cliente.correo?.trim() ||
      !cliente.telefono?.trim()
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: "¡Éxito!",
          text: data.mensaje || "Cliente guardado correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/clientes");
      } else {
        Swal.fire({
          title: "Error!",
          text: data.mensaje || "No se pudo guardar el cliente",
          icon: "warning",
        });
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
    navigate("/clientes");
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
                <FaUser size={22} color="#b71c1c" />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nuevo Cliente
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
                        value={cliente.nombre}
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
                        value={cliente.apellido}
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
                        Documento
                      </Label>
                      <Input
                        type="text"
                        name="documento"
                        value={cliente.documento}
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
                        Correo
                      </Label>
                      <Input
                        type="email"
                        name="correo"
                        value={cliente.correo}
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
                  <Label style={{ fontWeight: "bold", color: "#333" }}>Teléfono</Label>
                  <Input
                    type="text"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
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
