import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IUsuario } from "../../Interfaces/IUsuario";
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
import { NuevoUsuarioModal } from "./NuevoUsuario";
import { EditarUsuarioModal } from "./EditarUsuario";
import { VerDetalleUsuario } from "./verDetallesUsuarios";

export function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Usuarios/Lista`);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de usuarios", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const eliminar = (idUsuario: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar usuario!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Usuarios/Eliminar/${idUsuario}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          await obtenerUsuarios();
          Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  // Lógica de búsqueda y paginación
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.usuario1.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * usuariosPorPagina;
  const indexPrimero = indexUltimo - usuariosPorPagina;
  const usuariosActuales = usuariosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, usuariosPorPagina]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Usuarios</h2>
              <p className="text-muted">Administra los usuarios registrados</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              <FaPlus className="me-2" /> Nuevo Usuario
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar por usuario..."
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
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosActuales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  usuariosActuales.map((usuario) => (
                    <tr key={usuario.idUsuario}>
                      <td>{usuario.idUsuario}</td>
                      <td>
                        <span>
                          {usuario.usuario1}
                        </span>
                      </td>
                      <td>{usuario.contrasena ?? "N/A"}</td>
                      <td>{usuario.rolNombre ?? "Sin rol"}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => setDetalleId(usuario.idUsuario)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => setEditarId(usuario.idUsuario)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => eliminar(usuario.idUsuario)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Controles de paginación - EXACTAMENTE IGUAL QUE ListaClientes */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <small className="text-muted">
                Mostrando {usuariosActuales.length} de {usuariosFiltrados.length} usuarios encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={usuariosPorPagina}
                onChange={(e) => {
                  setUsuariosPorPagina(Number(e.target.value));
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
            <NuevoUsuarioModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={obtenerUsuarios}
            />
          )}

          {editarId !== null && (
            <EditarUsuarioModal
              idUsuario={editarId}
              isOpen={true}
              onClose={() => setEditarId(null)}
              onSave={obtenerUsuarios}
            />
          )}

          {detalleId !== null && (
            <VerDetalleUsuario
              idUsuario={detalleId}
              onClose={() => setDetalleId(null)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
