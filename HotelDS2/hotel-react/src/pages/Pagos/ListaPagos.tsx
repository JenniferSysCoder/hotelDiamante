import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IPago } from "../../Interfaces/IPago";
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
import { NuevoPagoModal } from "./NuevoPago";
import { EditarPagoModal } from "./EditarPago";
import { VerDetallePago } from "./verDetallesPagos";

export function ListaPagos() {
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [pagosPorPagina, setPagosPorPagina] = useState(5);

  const obtenerPagos = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Pagos/Lista`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPagos(data);
        } else {
          Swal.fire("Error", "Formato de datos inesperado", "error");
        }
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de pagos", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar pago!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${appsettings.apiUrl}Pagos/Eliminar/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await obtenerPagos();
          Swal.fire("Eliminado", "El pago ha sido eliminado", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el pago", "error");
        }
      }
    });
  };

  // Lógica de búsqueda y paginación
  const pagosFiltrados = pagos.filter((p) =>
    p.nombreCliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexUltimo = paginaActual * pagosPorPagina;
  const indexPrimero = indexUltimo - pagosPorPagina;
  const pagosActuales = pagosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, pagosPorPagina]);

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? "Fecha inválida" : fechaObj.toLocaleDateString();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Pagos</h2>
              <p className="text-muted">Administra los pagos registrados de clientes</p>
            </div>
            <Button
              color="primary"
              className="rounded-pill fw-bold shadow-sm"
              onClick={() => setMostrarNuevo(true)}
            >
              <FaPlus className="me-2" /> Nuevo Pago
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
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosActuales.length > 0 ? (
                  pagosActuales.map((pago) => (
                    <tr key={pago.idPago}>
                      <td>{pago.idPago}</td>
                      <td>{formatearFecha(pago.fechaPago)}</td>
                      <td className="fw-bold text-success">
                        ${pago.monto.toFixed(2)}
                      </td>
                      <td>{pago.metodoPago}</td>
                      <td>{pago.idFactura}</td>
                      <td>{pago.nombreCliente}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => setDetalleId(pago.idPago)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => setEditarId(pago.idPago)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(pago.idPago)}
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
                      No se encontraron pagos.
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
                Mostrando {pagosActuales.length} de {pagosFiltrados.length} pagos encontrados
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={pagosPorPagina}
                onChange={(e) => {
                  setPagosPorPagina(Number(e.target.value));
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

          {mostrarNuevo && (
            <NuevoPagoModal
              isOpen={mostrarNuevo}
              onClose={() => setMostrarNuevo(false)}
              onSave={obtenerPagos}
            />
          )}

          {editarId !== null && (
            <EditarPagoModal
              idPago={editarId}
              isOpen={true}
              onClose={() => setEditarId(null)}
              onSave={obtenerPagos}
            />
          )}

          {detalleId !== null && (
            <VerDetallePago
              idPago={detalleId}
              onClose={() => setDetalleId(null)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
