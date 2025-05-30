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
} from "reactstrap";

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
          <h4>Editar Usuario</h4>
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
