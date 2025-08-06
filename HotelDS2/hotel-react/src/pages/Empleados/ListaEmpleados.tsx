import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IEmpleado } from "../../Interfaces/IEmpleado";
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
import { FaSearch, FaUser, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { EditarEmpleadoModal } from "./EditarEmpleado";
import { VerDetalleEmpleadoModal } from "./verDetalles";

export function ListaEmpleado() {
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState<number | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [empleadoDetalleId, setEmpleadoDetalleId] = useState<number | null>(null);

  // Estados para paginación igual que ListaClientes
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleadosPorPagina, setEmpleadosPorPagina] = useState(5);

  const abrirModal = (id: number) => {
    setEmpleadoSeleccionadoId(id);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEmpleadoSeleccionadoId(null);
    obtenerEmpleados();
  };

  const abrirDetalle = (id: number) => {
    setEmpleadoDetalleId(id);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setEmpleadoDetalleId(null);
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de empleados", "error");
      }
    } catch {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar empleado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Empleados/Eliminar/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          await obtenerEmpleados();
          Swal.fire("Eliminado", data.mensaje, "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el empleado", "error");
        }
      }
    });
  };

  // Lógica de búsqueda y paginación igual que ListaClientes
  const empleadosFiltrados = empleados.filter((emp) =>
    `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * empleadosPorPagina;
  const indexPrimero = indexUltimo - empleadosPorPagina;
  const empleadosActuales = empleadosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(empleadosFiltrados.length / empleadosPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, empleadosPorPagina]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Empleados</h2>
              <p className="text-muted">Administra tus empleados registrados</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => abrirModal(0)}
            >
              + Nuevo Empleado
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar empleado..."
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
                  <th>Empleado</th>
                  <th>Teléfono</th>
                  <th>Cargo</th>
                  <th>Hotel</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosActuales.length > 0 ? (
                  empleadosActuales.map((emp) => (
                    <tr key={emp.idEmpleado}>
                      <td>{emp.idEmpleado}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-danger-subtle d-inline-flex justify-content-center align-items-center me-2"
                            style={{ width: 40, height: 40 }}
                          >
                            <FaUser color="#b71c1c" />
                          </div>
                          <div>
                            <div className="fw-bold">
                              {emp.nombre} {emp.apellido}
                            </div>
                            <div className="text-muted small">
                              ID: {emp.idEmpleado}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{emp.telefono || <span className="text-muted">No definido</span>}</td>
                      <td>{emp.cargo}</td>
                      <td>{emp.nombreHotel || <span className="text-muted">No definido</span>}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => abrirDetalle(emp.idEmpleado)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => abrirModal(emp.idEmpleado)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(emp.idEmpleado)}
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
                      No se encontraron empleados.
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
                Mostrando {empleadosActuales.length} de {empleadosFiltrados.length} empleados encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={empleadosPorPagina}
                onChange={(e) => {
                  setEmpleadosPorPagina(Number(e.target.value));
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
          {mostrarModal && empleadoSeleccionadoId !== null && (
            <EditarEmpleadoModal
              idEmpleado={empleadoSeleccionadoId}
              onClose={cerrarModal}
            />
          )}

          {mostrarDetalle && empleadoDetalleId !== null && (
            <VerDetalleEmpleadoModal
              empleado={empleados.find((e) => e.idEmpleado === empleadoDetalleId)!}
              onClose={cerrarDetalle}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
