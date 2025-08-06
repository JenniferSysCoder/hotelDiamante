import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { ICliente } from "../../Interfaces/ICliente";
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
import { EditarClienteModal } from "./EditarCliente";
import { VerDetalleClienteModal } from "./verDetalles";
import { NuevoClienteModal } from "./NuevoCliente";

export function ListaClientes() {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<number | null>(null);

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [clienteDetalleId, setClienteDetalleId] = useState<number | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [clientesPorPagina, setClientesPorPagina] = useState(5);

  const abrirModal = (id: number) => {
    setClienteSeleccionadoId(id);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteSeleccionadoId(null);
    obtenerClientes();
  };

  const abrirDetalle = (id: number) => {
    setClienteDetalleId(id);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setClienteDetalleId(null);
  };

  const obtenerClientes = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Lista`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de clientes", "error");
      }
    } catch {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar cliente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Clientes/Eliminar/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          await obtenerClientes();
          Swal.fire("Eliminado", data.mensaje, "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el cliente", "error");
        }
      }
    });
  };

  // Lógica de búsqueda y paginación
  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * clientesPorPagina;
  const indexPrimero = indexUltimo - clientesPorPagina;
  const clientesPaginaActual = clientesFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, clientesPorPagina]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Clientes</h2>
              <p className="text-muted">Administra tus clientes registrados</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              + Nuevo Cliente
            </Button>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar cliente..."
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
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesPaginaActual.length > 0 ? (
                  clientesPaginaActual.map((cliente) => (
                    <tr key={cliente.idCliente}>
                      <td>{cliente.idCliente}</td>
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
                              {cliente.nombre} {cliente.apellido}
                            </div>
                            <div className="text-muted small">
                              ID: {cliente.idCliente}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{cliente.documento}</td>
                      <td>{cliente.correo || <span className="text-muted">No definido</span>}</td>
                      <td>{cliente.telefono || <span className="text-muted">No definido</span>}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => abrirDetalle(cliente.idCliente)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => abrirModal(cliente.idCliente)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(cliente.idCliente!)}
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
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Controles de paginación */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <small className="text-muted">
                Mostrando {clientesPaginaActual.length} de {clientesFiltrados.length} clientes encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={clientesPorPagina}
                onChange={(e) => {
                  setClientesPorPagina(Number(e.target.value));
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
            <NuevoClienteModal
              isOpen={mostrarNuevo}
              onClose={() => {
                setMostrarNuevo(false);
                obtenerClientes();
              }}
            />
          )}
          {mostrarModal && clienteSeleccionadoId && (
            <EditarClienteModal
              idCliente={clienteSeleccionadoId}
              onClose={cerrarModal}
              onSave={obtenerClientes}
            />
          )}
          {mostrarDetalle && clienteDetalleId !== null && (
            <VerDetalleClienteModal
              cliente={clientes.find((c) => c.idCliente === clienteDetalleId)!}
              onClose={cerrarDetalle}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
