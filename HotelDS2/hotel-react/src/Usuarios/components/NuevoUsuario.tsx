import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
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
} from "reactstrap";

const initialUsuario: IUsuario = {
  id: 0,
  usuario1: "",
  contrasenia: "",
};

export function NuevoUsuario() {
  const [usuario, setUsuario] = useState<IUsuario>(initialUsuario);
  const navigate = useNavigate();

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

    try {
      const response = await fetch(`${appsettings.apiUrl}Usuarios/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Éxito", "Usuario guardado correctamente", "success");
        navigate("/usuarios");
      } else {
        Swal.fire(
          "Error",
          data.mensaje || "No se pudo guardar el usuario",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión al guardar usuario", "error");
      console.error(error);
    }
  };

  const volver = () => {
    navigate("/usuarios");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Nuevo Usuario</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Usuario</Label>
              <Input
                type="text"
                name="usuario1"
                onChange={inputChangeValue}
                value={usuario.usuario1}
              />
            </FormGroup>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input
                type="password"
                name="contrasenia"
                onChange={inputChangeValue}
                value={usuario.contrasenia}
              />
            </FormGroup>
          </Form>
          <Button color="primary" className="me-4" onClick={guardar}>
            Guardar
          </Button>
          <Button color="secondary" onClick={volver}>
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
