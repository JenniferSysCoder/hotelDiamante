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
  Card,
  CardBody,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash, FaBed } from "react-icons/fa";

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
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaBed size={28} color="#b71c1c" />
                  <h4 style={{ margin: 0, fontWeight: "bold", color: "#23272f" }}>
                    Lista de habitaciones
                  </h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevahabitacion"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nueva Habitación
                </Link>
              </div>
              <Row className="mb-3 align-items-center">
                <Col md="6"></Col>
                <Col md="6" className="text-end">
                  <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                    <InputGroupText style={{ background: "#fff" }}>
                      <FaSearch color="#b71c1c" />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por número..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{
                        borderRadius: "0 24px 24px 0",
                        borderLeft: "none",
                        background: "#fff",
                      }}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <div style={{ overflowX: "auto" }}>
                <Table
                  bordered
                  responsive
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px #23272f22",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ background: "#b71c1c", color: "#fff" }}>
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
                        <td>
                          <span
                            style={{
                              background: "#fbe9e7",
                              color: "#b71c1c",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "2px 10px",
                            }}
                          >
                            {hab.numero}
                          </span>
                        </td>
                        <td>{hab.tipo}</td>
                        <td>
                          <span style={{ color: "#388e3c", fontWeight: "bold" }}>
                            ${hab.precioNoche.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              background:
                                hab.estado === "Disponible"
                                  ? "#e8f5e9"
                                  : "#ffebee",
                              color:
                                hab.estado === "Disponible"
                                  ? "#388e3c"
                                  : "#b71c1c",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "2px 10px",
                            }}
                          >
                            {hab.estado}
                          </span>
                        </td>
                        <td>{hab.nombreHotel}</td>
                        <td className="text-center">
                          <Link
                            className="btn btn-primary me-2"
                            to={`editarhabitacion/${hab.idHabitacion}`}
                            style={{
                              borderRadius: "18px",
                              fontWeight: "bold",
                              boxShadow: "0 2px 8px #23272f22",
                            }}
                          >
                            <FaEdit className="me-1" />
                            Editar
                          </Link>
                          <Button
                            color="danger"
                            onClick={() => Eliminar(hab.idHabitacion)}
                            style={{
                              borderRadius: "18px",
                              fontWeight: "bold",
                              boxShadow: "0 2px 8px #b71c1c22",
                            }}
                          >
                            <FaTrash className="me-1" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}