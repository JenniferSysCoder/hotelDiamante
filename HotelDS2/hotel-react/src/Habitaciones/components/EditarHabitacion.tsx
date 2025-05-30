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
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IHabitacion } from "../Interfaces/IHabitacion";

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
  const [hoteles, setHoteles] = useState<{ idHotel: number; nombre: string }[]>(
    []
  );
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
          <h4>Editar Habitación</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Número</Label>
              <Input
                type="text"
                name="numero"
                value={habitacion.numero}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Tipo</Label>
              <Input
                type="text"
                name="tipo"
                value={habitacion.tipo}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Precio por noche</Label>
              <Input
                type="number"
                name="precioNoche"
                value={habitacion.precioNoche}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Input
                type="text"
                name="estado"
                value={habitacion.estado}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Hotel</Label>
              <Input
                type="select"
                name="idHotel"
                value={habitacion.idHotel}
                onChange={inputChangeValue}
              >
                <option value={0}>Seleccione un hotel</option>
                {hoteles.map((hotel) => (
                  <option key={hotel.idHotel} value={hotel.idHotel}>
                    {hotel.nombre}
                  </option>
                ))}
              </Input>
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
