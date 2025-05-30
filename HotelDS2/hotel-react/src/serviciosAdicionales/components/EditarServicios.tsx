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
} from "reactstrap";

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
    setServicio({ ...servicio, [inputName]: inputValue });
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
          <h4>Editar Servicio</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                onChange={inputChangeValue}
                value={servicio.nombre}
              />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <Input
                type="text"
                name="descripcion"
                onChange={inputChangeValue}
                value={servicio.descripcion}
              />
            </FormGroup>
            <FormGroup>
              <Label>Precio</Label>
              <Input
                type="number"
                name="precio"
                onChange={inputChangeValue}
                value={servicio.precio}
                min="0"
                step="0.01"
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
