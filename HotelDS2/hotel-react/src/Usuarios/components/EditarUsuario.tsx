import { type ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import type { IUsuario } from "../Interfaces/IUsuario";
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
import { FaUserEdit, FaSave, FaArrowLeft } from "react-icons/fa";

const initialUsuario: IUsuario = {
  id: 0,
  usuario1: "",
  contrasenia: "",
};

export function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<IUsuario>(initialUsuario);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}Usuarios/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el usuario", "error");
      }
    };

    obtenerUsuario();
  }, [id]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setUsuario({ ...usuario, [inputName]: inputValue });
  };

  const guardar = async () => {
    if (usuario.usuario1.trim() === "" || usuario.contrasenia?.trim() === "") {
      Swal.fire(
        "Campos requeridos",
        "Por favor, completa todos los campos",
        "warning"
      );
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Usuarios/Editar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      Swal.fire("Éxito", "Usuario editado correctamente", "success");
      navigate("/usuarios");
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo editar el usuario",
        icon: "error",
      });
    }
  };

  const volver = () => {
    navigate("/usuarios");
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
                <h4 style={{ margin: 0 }}>Editar Usuario</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Usuario
                      </Label>
                      <Input
                        type="text"
                        name="usuario1"
                        onChange={inputChangeValue}
                        value={usuario.usuario1}
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
                        Contraseña
                      </Label>
                      <Input
                        type="password"
                        name="contrasenia"
                        onChange={inputChangeValue}
                        value={usuario.contrasenia}
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
