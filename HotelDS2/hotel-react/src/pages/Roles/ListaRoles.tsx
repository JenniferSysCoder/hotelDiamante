import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
  Alert,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import type { IRol } from "../../Interfaces/IRol";
import { NuevoRolModal } from "./NuevoRol";
import { EditarRolModal } from "./EditarRol";
import { VerDetalleRolModal } from "./verDetallesRoles";

export function ListaRoles() {
  const [roles, setRoles] = useState<IRol[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [rolesPorPagina, setRolesPorPagina] = useState(5);

  const obtenerRoles = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Roles/Lista`);
      if (!response.ok) throw new Error("Error al obtener roles");
      const data = await response.json();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRoles();
  }, []);

  const eliminarRol = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      const response = await fetch(`${appsettings.apiUrl}Roles/Eliminar/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        await obtenerRoles();
        Swal.fire("Eliminado", data.mensaje || "Rol eliminado correctamente", "success");
      } else {
        Swal.fire("Error", data.mensaje || "No se pudo eliminar el rol", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión al eliminar rol", "error");
    }
  };

  // Lógica de búsqueda y paginación
  const rolesFiltrados = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * rolesPorPagina;
  const indexPrimero = indexUltimo - rolesPorPagina;
  const rolesActuales = rolesFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(rolesFiltrados.length / rolesPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, rolesPorPagina]);

  if (loading) return <Spinner color="primary">Cargando...</Spinner>;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Roles</h2>
              <p className="text-muted">Administra los roles del sistema</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              <FaPlus className="me-2" /> Nuevo Rol
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar por rol..."
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
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Rol</th>
                  <th>Descripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rolesActuales.length > 0 ? (
                  rolesActuales.map((rol) => (
                    <tr key={rol.idRol}>
                      <td>{rol.idRol}</td>
                      <td>{rol.nombre}</td>
                      <td>{rol.descripcion || "-"}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => setDetalleId(rol.idRol)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => setEditarId(rol.idRol)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => eliminarRol(rol.idRol)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No se encontraron roles.
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
                Mostrando {rolesActuales.length} de {rolesFiltrados.length} roles encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={rolesPorPagina}
                onChange={(e) => {
                  setRolesPorPagina(Number(e.target.value));
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
          {mostrarNuevo && (
            <NuevoRolModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={obtenerRoles}
            />
          )}
          {editarId !== null && (
            <EditarRolModal
              idRol={editarId}
              isOpen={true}
              onClose={() => setEditarId(null)}
              onSave={obtenerRoles}
            />
          )}
          {detalleId !== null && (
            <VerDetalleRolModal
              idRol={detalleId}
              isOpen={true}
              onClose={() => setDetalleId(null)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
