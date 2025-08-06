import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IHabitacion } from "../../Interfaces/IHabitacion";
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
import { FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { VerDetalleHabitaciones } from "./verDetallesHabitaciones";
import { EditarHabitacionModal } from "./EditarHabitacion";
import { NuevaHabitacionModal } from "./NuevaHabitacion";

export function ListaHabitacion() {
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [habitacionSeleccionadaId, setHabitacionSeleccionadaId] = useState<number | null>(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [habitacionDetalle, setHabitacionDetalle] = useState<IHabitacion | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [habitacionesPorPagina, setHabitacionesPorPagina] = useState(5);

  const obtenerHabitaciones = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de habitaciones", "error");
      }
    } catch (error) {
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
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Habitaciones/Eliminar/${id}`, {
          method: "DELETE",
        });
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

  // Lógica de búsqueda y paginación
  const habitacionesFiltradas = habitaciones.filter((hab) =>
    hab.numero?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * habitacionesPorPagina;
  const indexPrimero = indexUltimo - habitacionesPorPagina;
  const habitacionesActuales = habitacionesFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(habitacionesFiltradas.length / habitacionesPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, habitacionesPorPagina]);

  const abrirDetalle = (habitacion: IHabitacion) => {
    setHabitacionDetalle(habitacion);
    setMostrarDetalle(true);
  };

  const abrirModal = (id: number) => {
    setHabitacionSeleccionadaId(id);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setHabitacionSeleccionadaId(null);
    obtenerHabitaciones();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Habitaciones</h2>
              <p className="text-muted">Administra tus habitaciones disponibles</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              + Nueva Habitación
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar número de habitación..."
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
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Precio por noche</th>
                  <th>Estado</th>
                  <th>Hotel</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {habitacionesActuales.length > 0 ? (
                  habitacionesActuales.map((hab) => (
                    <tr key={hab.idHabitacion}>
                      <td>{hab.idHabitacion}</td>
                      <td>{hab.numero}</td>
                      <td>{hab.tipo}</td>
                      <td className="fw-bold text-success">
                        ${hab.precioNoche.toFixed(2)}
                      </td>
                      <td>
                        <span
                          style={{
                            background:
                              hab.estado === "Disponible" ? "#d4edda" : "#f8d7da",
                            color:
                              hab.estado === "Disponible" ? "#155724" : "#721c24",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            display: "inline-block",
                            fontSize: "0.85rem",
                          }}
                        >
                          {hab.estado}
                        </span>
                      </td>
                      <td>{hab.nombreHotel}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => abrirDetalle(hab)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => abrirModal(hab.idHabitacion)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(hab.idHabitacion)}
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
                      No se encontraron habitaciones.
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
                Mostrando {habitacionesActuales.length} de {habitacionesFiltradas.length} habitaciones encontradas
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={habitacionesPorPagina}
                onChange={(e) => {
                  setHabitacionesPorPagina(Number(e.target.value));
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

          {/* Modales - igual que antes */}
          {mostrarNuevo && (
            <NuevaHabitacionModal
              isOpen={mostrarNuevo}
              onClose={() => {
                setMostrarNuevo(false);
                obtenerHabitaciones();
              }}
              onSave={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}

          {mostrarModal && habitacionSeleccionadaId && habitacionSeleccionadaId > 0 && (
            <EditarHabitacionModal
              idHabitacion={habitacionSeleccionadaId}
              onClose={cerrarModal}
              onSave={obtenerHabitaciones}
            />
          )}

          {mostrarDetalle && habitacionDetalle && (
            <VerDetalleHabitaciones
              isOpen={mostrarDetalle}
              habitacion={habitacionDetalle}
              onClose={() => setMostrarDetalle(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
