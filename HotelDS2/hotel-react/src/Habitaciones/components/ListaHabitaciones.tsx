import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IHabitacion } from "../Interfaces/IHabitacion";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

export function ListaHabitacion() {
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerHabitaciones = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data);
      } else {
        console.error("Error al obtener habitaciones:", response.statusText);
        Swal.fire(
          "Error",
          "No se pudo obtener la lista de habitaciones",
          "error"
        );
      }
    } catch (error) {
      console.error("Error de red al obtener habitaciones:", error);
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar habitación!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Habitaciones/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const data = await response.json();
          await obtenerHabitaciones();
          Swal.fire("Eliminado", data.mensaje, "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la habitación", "error");
        }
      }
    });
  };

  const habitacionesFiltradas = habitaciones.filter((habitacion) =>
    habitacion.numero?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <h4>Lista de habitaciones</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevahabitacion">
                Nueva Habitación
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por número..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          <Table bordered responsive>
            <thead>
              <tr>
                <th>Id</th>
                <th>Número</th>
                <th>Tipo</th>
                <th>Precio por noche</th>
                <th>Estado</th>
                <th>Hotel</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {habitacionesFiltradas.map((hab) => (
                <tr key={hab.idHabitacion}>
                  <td>{hab.idHabitacion}</td>
                  <td>{hab.numero}</td>
                  <td>{hab.tipo}</td>
                  <td>${hab.precioNoche.toFixed(2)}</td>
                  <td>{hab.estado}</td>
                  <td>{hab.nombreHotel}</td>
                  <td className="text-center">
                    <Link
                      className="btn btn-primary me-2"
                      to={`editarhabitacion/${hab.idHabitacion}`}
                    >
                      <FaEdit className="me-1" />
                      Editar
                    </Link>
                    <Button
                      color="danger"
                      onClick={() => Eliminar(hab.idHabitacion)}
                    >
                      <FaTrash className="me-1" />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
