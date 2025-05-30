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
import type { IEmpleado } from "../Interfaces/IEmpleado";
import type { IHotel } from "../../Hotel/Interfaces/IHotel";

const initialEmpleado: IEmpleado = {
  idEmpleado: 0,
  nombre: "",
  apellido: "",
  cargo: "",
  telefono: "",
  idHotel: 0,
  nombreHotel: "",
};

export function EditarEmpleado() {
  const { id } = useParams<{ id: string }>();
  const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpleado = async () => {
      const response = await fetch(
        `${appsettings.apiUrl}Empleados/Obtener/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmpleado(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el empleado", "error");
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

    obtenerEmpleado();
    obtenerHoteles();
  }, [id]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEmpleado({
      ...empleado,
      [name]: name === "idHotel" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      !empleado.nombre.trim() ||
      !empleado.apellido.trim() ||
      !empleado.cargo.trim() ||
      !empleado.telefono?.trim() ||
      empleado.idHotel === 0
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor completa todos los campos obligatorios",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(
        `${appsettings.apiUrl}Empleados/Editar/${empleado.idEmpleado}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empleado),
        }
      );

      if (response.ok) {
        Swal.fire("Guardado", "Empleado actualizado correctamente", "success");
        navigate("/empleados");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.mensaje || "No se pudo actualizar el empleado",
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
    navigate("/empleados");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Editar Empleado</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={empleado.nombre}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Apellido</Label>
              <Input
                type="text"
                name="apellido"
                value={empleado.apellido}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Cargo</Label>
              <Input
                type="text"
                name="cargo"
                value={empleado.cargo}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Teléfono</Label>
              <Input
                type="text"
                name="telefono"
                value={empleado.telefono}
                onChange={inputChangeValue}
              />
            </FormGroup>
            <FormGroup>
              <Label>Hotel</Label>
              <Input
                type="select"
                name="idHotel"
                value={empleado.idHotel}
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
