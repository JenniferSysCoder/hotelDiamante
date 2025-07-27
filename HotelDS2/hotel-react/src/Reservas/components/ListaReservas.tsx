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
  Card,
  CardBody,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";

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

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return "Fecha inválida";
    return fecha.toLocaleDateString();
  };

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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#23272f",
                    fontWeight: "bold",
                  }}
                >
                  <FaCalendarAlt size={28} color="#1b5e20" />
                  <h4 style={{ margin: 0 }}>Lista de Reservas</h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevareserva"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #1b5e2022",
                  }}
                >
                  Nueva Reserva
                </Link>
              </div>

              <Row className="mb-3 align-items-center">
                <Col md="6"></Col>
                <Col md="6" className="text-end">
                  <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                    <InputGroupText style={{ background: "#fff" }}>
                      <FaSearch color="#1b5e20" />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por cliente..."
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
                  <thead style={{ background: "#1b5e20", color: "#fff" }}>
                    <tr>
                      <th>Id</th>
                      <th>Cliente</th>
                      <th>Habitación</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasFiltradas.length > 0 ? (
                      reservasFiltradas.map((res) => (
                        <tr key={res.idReserva}>
                          <td>{res.idReserva}</td>
                          <td>{res.nombreCliente ?? "N/D"}</td>
                          <td>{res.numeroHabitacion ?? "N/D"}</td>
                          <td>{formatearFecha(res.fechaInicio)}</td>
                          <td>{formatearFecha(res.fechaFin)}</td>
                          <td>{res.estado ?? "N/D"}</td>
                          <td className="text-center">
                            <Link
                              className="btn btn-primary me-2"
                              to={`editarreserva/${res.idReserva}`}
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
                              onClick={() => Eliminar(res.idReserva)}
                              style={{
                                borderRadius: "18px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 8px #1b5e2022",
                              }}
                            >
                              <FaTrash className="me-1" />
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No se encontraron reservas
                        </td>
                      </tr>
                    )}
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
