import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IServicio } from "../../Interfaces/IServicio";
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
import { EditarServicioModal } from "./EditarServicios";
import { NuevoServicioModal } from "./NuevoServicio";
import { VerDetalleServicio } from "./verDetallesServicios";

export function ListaServicios() {
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [servicioDetalle, setServicioDetalle] = useState<IServicio | null>(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<IServicio | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [serviciosPorPagina, setServiciosPorPagina] = useState(5);

  const obtenerServicios = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`);
      if (response.ok) {
        const data = await response.json();
        setServicios(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de servicios", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar servicio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}ServiciosAdicionales/Eliminar/${id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          await obtenerServicios();
          Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el servicio", "error");
        }
      }
    });
  };

  const abrirDetalle = (servicio: IServicio) => {
    setServicioDetalle(servicio);
    setMostrarDetalle(true);
  };

  const abrirEditar = (servicio: IServicio) => {
    setServicioEditar(servicio);
    setMostrarEditar(true);
  };

  // Lógica de búsqueda y paginación
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * serviciosPorPagina;
  const indexPrimero = indexUltimo - serviciosPorPagina;
  const serviciosActuales = serviciosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(serviciosFiltrados.length / serviciosPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, serviciosPorPagina]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Servicios</h2>
              <p className="text-muted mb-0">Administra los servicios adicionales</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              + Nuevo Servicio
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar servicio..."
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
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {serviciosActuales.length > 0 ? (
                  serviciosActuales.map((servicio) => (
                    <tr key={servicio.idServicio}>
                      <td>{servicio.idServicio}</td>
                      <td>{servicio.nombre}</td>
                      <td>
                        {servicio.descripcion || (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td className="fw-bold text-success">
                        ${servicio.precio.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            color="outline-info"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => abrirDetalle(servicio)}
                            title="Ver detalles"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            color="outline-primary"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => abrirEditar(servicio)}
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            color="outline-danger"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => Eliminar(servicio.idServicio)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No se encontraron servicios.
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
                Mostrando {serviciosActuales.length} de {serviciosFiltrados.length} servicios encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={serviciosPorPagina}
                onChange={(e) => {
                  setServiciosPorPagina(Number(e.target.value));
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

          {/* Modal Nuevo */}
          {mostrarNuevo && (
            <NuevoServicioModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={() => {
                setMostrarNuevo(false);
                obtenerServicios();
              }}
            />
          )}

          {/* Modal Editar */}
          {mostrarEditar && servicioEditar && (
            <EditarServicioModal
              isOpen={mostrarEditar}
              idServicio={servicioEditar.idServicio}
              onClose={() => {
                setMostrarEditar(false);
                setServicioEditar(null);
              }}
              onSave={() => {
                setMostrarEditar(false);
                setServicioEditar(null);
                obtenerServicios();
              }}
            />
          )}

          {/* Modal Detalle */}
          {mostrarDetalle && servicioDetalle && (
            <VerDetalleServicio
              isOpen={mostrarDetalle}
              servicio={servicioDetalle}
              onClose={() => setMostrarDetalle(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
