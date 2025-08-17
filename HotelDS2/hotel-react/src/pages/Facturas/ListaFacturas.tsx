import { useEffect, useMemo, useState, useCallback } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IFactura } from "../../Interfaces/IFactura";
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
} from "reactstrap";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileInvoice,
  FaPrint,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NuevaFacturaModal } from "./NuevaFactura";
import { EditarFacturaModal } from "./EditarFactura";
import { VerDetallesFactura } from "./verDetallesFacturas";

export function ListaFacturas() {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [facturaEditarId, setFacturaEditarId] = useState<number | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [facturaDetalleId, setFacturaDetalleId] = useState<number | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [facturasPorPagina, setFacturasPorPagina] = useState(5);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const obtenerFacturas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${appsettings.apiUrl}Facturas/Lista`);
      if (!response.ok) throw new Error("No se pudo obtener la lista de facturas");
      const data = await response.json();
      if (Array.isArray(data)) setFacturas(data);
      else setFacturas([]);
    } catch (e: any) {
      Swal.fire("Error", e?.message || "Hubo un problema de conexión", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerFacturas();
  }, [obtenerFacturas]);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar factura!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      const response = await fetch(`${appsettings.apiUrl}Facturas/Eliminar/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await obtenerFacturas();
        Swal.fire("Eliminado", "La factura ha sido eliminada", "success");
      } else {
        const txt = await response.text();
        Swal.fire("Error", txt || "No se pudo eliminar la factura", "error");
      }
    });
  };

  // ---- Formateadores seguros
  const fmtMoney = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  const fmtDate = (d: string | Date) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  // ---- Debounce de búsqueda
  const [entradaBusqueda, setEntradaBusqueda] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setBusqueda(entradaBusqueda.trim()), 250);
    return () => clearTimeout(t);
  }, [entradaBusqueda]);

  // ---- Filtro y paginación
  const facturasFiltradas = useMemo(() => {
    if (!busqueda) return facturas;
    const q = busqueda.toLowerCase();
    return facturas.filter((f) => {
      const texto = `${f.idFactura} ${f.nombreCliente} ${f.nombreServicio} ${f.numeroHabitacion}`.toLowerCase();
      return texto.includes(q);
    });
  }, [facturas, busqueda]);

  const indexUltimo = paginaActual * facturasPorPagina;
  const indexPrimero = indexUltimo - facturasPorPagina;
  const facturasActuales = facturasFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.max(1, Math.ceil(facturasFiltradas.length / facturasPorPagina));

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual((p) => p + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual((p) => p - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, facturasPorPagina]);

  const abrirEditar = (id: number) => {
    setFacturaEditarId(id);
    setMostrarEditar(true);
  };

  const cerrarEditar = () => {
    setMostrarEditar(false);
    setFacturaEditarId(null);
    obtenerFacturas();
  };

  const abrirDetalle = (id: number) => {
    setFacturaDetalleId(id);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setFacturaDetalleId(null);
  };

  const generarFactura = (id: number) => {
    navigate(`/facturas/verfactura/${id}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Gestión de Facturas</h2>
              <p className="text-muted mb-0">Administra las facturas emitidas</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                color="primary"
                className="rounded-pill fw-bold shadow-sm"
                onClick={() => setMostrarNuevo(true)}
              >
                + Nueva Factura
              </Button>
            </div>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <InputGroup>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  placeholder="Buscar por ID, cliente, servicio o habitación..."
                  value={entradaBusqueda}
                  onChange={(e) => setEntradaBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md="6" className="text-end">
              <small className="text-muted">
                {loading ? "Cargando..." : <>Mostrando {facturasActuales.length} de {facturasFiltradas.length} facturas encontradas</>}
              </small>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table className="align-middle table-hover border">
              <thead className="table-light text-secondary fw-bold">
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Habitación</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <Spinner size="sm" /> &nbsp;Cargando facturas...
                    </td>
                  </tr>
                ) : facturasActuales.length > 0 ? (
                  facturasActuales.map((f) => (
                    <tr key={f.idFactura}>
                      <td>{f.idFactura}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-info-subtle d-inline-flex justify-content-center align-items-center me-2"
                            style={{ width: 40, height: 40 }}
                          >
                            <FaFileInvoice color="#0277bd" />
                          </div>
                          <div>
                            <div className="fw-bold">{f.nombreCliente}</div>
                            <div className="text-muted small">Factura #{f.idFactura}</div>
                          </div>
                        </div>
                      </td>
                      <td>{f.nombreServicio}</td>
                      <td>{f.numeroHabitacion || "N/A"}</td>
                      <td>{fmtDate(f.fechaEmision)}</td>
                      <td className="fw-bold text-success">
                        {fmtMoney.format(Number(f.total || 0))}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            color="outline-info"
                            className="rounded-circle"
                            title="Ver detalles"
                            onClick={() => abrirDetalle(f.idFactura)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-primary"
                            className="rounded-circle"
                            title="Editar"
                            onClick={() => abrirEditar(f.idFactura)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-danger"
                            className="rounded-circle"
                            title="Eliminar"
                            onClick={() => Eliminar(f.idFactura)}
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            size="sm"
                            color="outline-secondary"
                            className="rounded-circle"
                            title="Generar factura"
                            onClick={() => generarFactura(f.idFactura)}
                          >
                            <FaPrint />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No se encontraron facturas.
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
                {loading ? " " : <>Mostrando {facturasActuales.length} de {facturasFiltradas.length} facturas encontradas</>}
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Por página:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px" }}
                value={facturasPorPagina}
                onChange={(e) => {
                  setFacturasPorPagina(Number(e.target.value));
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
            <NuevaFacturaModal
              isOpen={mostrarNuevo}
              onClose={() => {
                setMostrarNuevo(false);
                obtenerFacturas();
              }}
            />
          )}
          {mostrarEditar && facturaEditarId && (
            <EditarFacturaModal idFactura={facturaEditarId} onClose={cerrarEditar} />
          )}
          {mostrarDetalle && facturaDetalleId && (
            <VerDetallesFactura idFactura={facturaDetalleId} onClose={cerrarDetalle} />
          )}
        </Col>
      </Row>
    </Container>
  );
}
