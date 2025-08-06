import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { IHotel } from "../../Interfaces/IHotel";
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

const initialHotel: IHotel = {
  idHotel: 0,
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  categoria: "",
};

export function NuevoHotel() {
  const [hotel, setHotel] = useState<IHotel>(initialHotel);
  const navigate = useNavigate();

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setHotel({ ...hotel, [inputName]: inputValue });
  };

  const guardar = async () => {
    const response = await fetch(`${appsettings.apiUrl}Hoteles/Nuevo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    });

    if (response.ok) {
      navigate("/hotel");
    } else {
      Swal.fire({
        title: "Error!",
        text: "No se pudo guardar el hotel",
        icon: "warning",
      });
    }
  };

  const volver = () => {
    navigate("/hotel");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Nuevo Hotel</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                onChange={inputChangeValue}
                value={hotel.nombre}
              />
            </FormGroup>
            <FormGroup>
              <Label>Dirección</Label>
              <Input
                type="text"
                name="direccion"
                onChange={inputChangeValue}
                value={hotel.direccion}
              />
            </FormGroup>
            <FormGroup>
              <Label>Teléfono</Label>
              <Input
                type="text"
                name="telefono"
                onChange={inputChangeValue}
                value={hotel.telefono}
              />
            </FormGroup>
            <FormGroup>
              <Label>Correo</Label>
              <Input
                type="email"
                name="correo"
                onChange={inputChangeValue}
                value={hotel.correo}
              />
            </FormGroup>
            <FormGroup>
              <Label>Categoría</Label>
              <Input
                type="text"
                name="categoria"
                onChange={inputChangeValue}
                value={hotel.categoria}
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
