import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IReserva } from "../../Interfaces/IReserva";
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
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { VerDetalleReserva } from "./verDetallesReservas";
import { EditarReservaModal } from "./EditarReserva";
import { NuevaReservaModal } from "./NuevaReserva";

export function ListaReserva() {
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [reservasPorPagina, setReservasPorPagina] = useState(5);

  const obtenerReservas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Lista`);
      if (response.ok) {
        const data = await response.json();
        setReservas(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de reservas", "error");
      }
    } catch (error) {
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
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Reservas/Eliminar/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Swal.fire("Eliminada", "La reserva fue eliminada", "success");
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

  const indexUltimo = paginaActual * reservasPorPagina;
  const indexPrimero = indexUltimo - reservasPorPagina;
  const reservasActuales = reservasFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, reservasPorPagina]);

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime())
      ? "Fecha inválida"
      : fecha.toLocaleDateString();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Reservas</h2>
              <p className="text-muted">Administra todas las reservas registradas</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              <FaPlus className="me-2" />
              Nueva Reserva
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar por cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table className="align-middle table-hover border">
              <thead className="table-light text-secondary fw-bold">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Habitación</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasActuales.length > 0 ? (
                  reservasActuales.map((res) => (
                    <tr key={res.idReserva}>
                      <td>{res.idReserva}</td>
                      <td>{res.nombreCliente ?? "N/D"}</td>
                      <td>{res.numeroHabitacion ?? "N/D"}</td>
                      <td>{formatearFecha(res.fechaInicio)}</td>
                      <td>{formatearFecha(res.fechaFin)}</td>
                      <td>
                        <span
                          style={{
                            background:
                              res.estado === "Reservada"
                                ? "#d4edda"
                                : res.estado === "Finalizada"
                                ? "#d1ecf1"
                                : "#f8d7da",
                            color:
                              res.estado === "Reservada"
                                ? "#155724"
                                : res.estado === "Finalizada"
                                ? "#0c5460"
                                : "#721c24",
                            padding: "6px 12px",
                            borderRadius: "25px",
                            fontWeight: 600,
                            display: "inline-block",
                            fontSize: "0.8rem",
                          }}
                        >
                          {res.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => setDetalleId(res.idReserva)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => setEditarId(res.idReserva)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(res.idReserva)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No se encontraron reservas.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Controles de paginación - EXACTAMENTE IGUAL QUE ListaClientes */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <small className="text-muted">
                Mostrando {reservasActuales.length} de {reservasFiltradas.length} reservas encontradas
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={reservasPorPagina}
                onChange={(e) => {
                  setReservasPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>

              <Button
                size="sm"
                color="secondary"
                outline
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </Button>
              <span className="text-muted small">
                Página {paginaActual} de {totalPaginas}
              </span>
              <Button
                size="sm"
                color="secondary"
                outline
                onClick={siguientePagina}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </Button>
            </div>
          </div>

          {/* Modales */}
          {detalleId !== null && (
            <VerDetalleReserva
              idReserva={detalleId}
              onClose={() => setDetalleId(null)}
            />
          )}

          {editarId !== null && (
            <EditarReservaModal
              idReserva={editarId}
              isOpen={editarId !== null}
              onClose={() => setEditarId(null)}
              onSave={obtenerReservas}
            />
          )}

          {mostrarNuevo && (
            <NuevaReservaModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={obtenerReservas}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
