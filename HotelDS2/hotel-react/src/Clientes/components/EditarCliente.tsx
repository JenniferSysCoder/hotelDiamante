import { type ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
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
import { FaUserEdit } from "react-icons/fa";

const initialCliente: ICliente = {
  idCliente: 0,
  nombre: "",
  apellido: "",
  documento: "",
  correo: "",
  telefono: "",
};

export function EditarCliente() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<ICliente>(initialCliente);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerCliente = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}Clientes/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCliente(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el cliente", "error");
      }
    };

    obtenerCliente();
  }, [id]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setCliente({ ...cliente, [inputName]: inputValue });
  };

  const guardar = async () => {
    if (
      !cliente.nombre.trim() ||
      !cliente.apellido.trim() ||
      !cliente.documento.trim() ||
      !cliente.telefono?.trim() ||
      !cliente.correo?.trim()
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const responseText = await response.text();
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { mensaje: responseText };
      }

      if (response.ok) {
        Swal.fire("Guardado", "Cliente actualizado correctamente", "success");
        navigate("/clientes");
      } else {
        Swal.fire(
          "Error",
          parsedResponse.mensaje || "No se pudo actualizar el cliente",
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
    navigate("/clientes");
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
                <h4 style={{ margin: 0 }}>Editar Cliente</h4>
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
                        value={cliente.nombre}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
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
                        onChange={inputChangeValue}
                        value={cliente.apellido}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Documento</Label>
                      <Input
                        type="text"
                        name="documento"
                        onChange={inputChangeValue}
                        value={cliente.documento}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Correo</Label>
                      <Input
                        type="email"
                        name="correo"
                        onChange={inputChangeValue}
                        value={cliente.correo}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
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
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>Teléfono</Label>
                      <Input
                        type="text"
                        name="telefono"
                        onChange={inputChangeValue}
                        value={cliente.telefono}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "500",
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