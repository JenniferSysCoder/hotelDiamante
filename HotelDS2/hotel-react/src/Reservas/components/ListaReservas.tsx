import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IReserva } from "../Interfaces/IReserva";
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
import { FaSearch } from "react-icons/fa";

export function ListaReserva() {
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerReservas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Lista`);
      if (response.ok) {
        const data = await response.json();
        setReservas(data);
      } else {
        console.error("Error al obtener reservas:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de reservas", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener reservas:", error);
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar reserva!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Reservas/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          Swal.fire(
            "Eliminada",
            "La reserva fue eliminada correctamente",
            "success"
          );
          await obtenerReservas();
        } else {
          Swal.fire("Error", "No se pudo eliminar la reserva", "error");
        }
      }
    });
  };

  const reservasFiltradas = reservas.filter((res) =>
    res.nombreCliente?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <h4>Lista de reservas</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevareserva">
                Nueva Reserva
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por cliente..."
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
                <th>Cliente</th>
                <th>Habitación</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((res) => (
                <tr key={res.idReserva}>
                  <td>{res.idReserva}</td>
                  <td>{res.nombreCliente ?? "N/D"}</td>
                  <td>{res.numeroHabitacion ?? "N/D"}</td>
                  <td>{res.fechaInicio.slice(0, 10)}</td>
                  <td>{res.fechaFin.slice(0, 10)}</td>
                  <td>{res.estado ?? "N/D"}</td>
                  <td>
                    <Link
                      className="btn btn-primary me-2"
                      to={`editarreserva/${res.idReserva}`}
                    >
                      Editar
                    </Link>
                    <Button
                      color="danger"
                      onClick={() => Eliminar(res.idReserva)}
                    >
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
