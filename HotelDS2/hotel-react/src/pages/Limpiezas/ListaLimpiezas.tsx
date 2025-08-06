import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { ILimpieza } from "../../Interfaces/ILimpieza";
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
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { NuevaLimpiezaModal } from "./NuevaLimpieza";
import { EditarLimpiezaModal } from "./EditarLimpieza";
import { VerDetalleLimpieza } from "./verDetallesLimpiezas";

export function ListaLimpieza() {
  const [limpiezas, setLimpiezas] = useState<ILimpieza[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [limpiezasPorPagina, setLimpiezasPorPagina] = useState(5);

  const obtenerLimpiezas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Limpiezas/Lista`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setLimpiezas(data);
        } else {
          Swal.fire("Error", "Formato de datos inesperado", "error");
        }
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de limpiezas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerLimpiezas();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar limpieza!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Limpiezas/Eliminar/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await obtenerLimpiezas();
          Swal.fire("Eliminado", "La limpieza ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la limpieza", "error");
        }
      }
    });
  };

  // Lógica de búsqueda y paginación
  const limpiezasFiltradas = limpiezas.filter((limpieza) =>
    limpieza.numeroHabitacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * limpiezasPorPagina;
  const indexPrimero = indexUltimo - limpiezasPorPagina;
  const limpiezasActuales = limpiezasFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(limpiezasFiltradas.length / limpiezasPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, limpiezasPorPagina]);

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      return "Fecha inválida";
    }
    return fechaObj.toLocaleDateString();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Limpiezas</h2>
              <p className="text-muted">Administra las tareas de limpieza registradas</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              <FaPlus className="me-2" /> Nueva Limpieza
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar habitación..."
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
                  <th>Fecha</th>
                  <th>Observaciones</th>
                  <th>Habitación</th>
                  <th>Empleado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {limpiezasActuales.length > 0 ? (
                  limpiezasActuales.map((limpieza) => (
                    <tr key={limpieza.idLimpieza}>
                      <td>{limpieza.idLimpieza}</td>
                      <td>{formatearFecha(limpieza.fecha)}</td>
                      <td>{limpieza.observaciones}</td>
                      <td>{limpieza.numeroHabitacion}</td>
                      <td>{limpieza.nombreEmpleado}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => setDetalleId(limpieza.idLimpieza)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => setEditarId(limpieza.idLimpieza)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(limpieza.idLimpieza)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No se encontraron limpiezas
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
                Mostrando {limpiezasActuales.length} de {limpiezasFiltradas.length} limpiezas encontradas
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={limpiezasPorPagina}
                onChange={(e) => {
                  setLimpiezasPorPagina(Number(e.target.value));
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
            <NuevaLimpiezaModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={obtenerLimpiezas}
            />
          )}

          {editarId !== null && (
            <EditarLimpiezaModal
              idLimpieza={editarId}
              isOpen={true}
              onClose={() => setEditarId(null)}
              onSave={obtenerLimpiezas}
            />
          )}

          {detalleId !== null && (
            <VerDetalleLimpieza
              idLimpieza={detalleId}
              onClose={() => setDetalleId(null)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
