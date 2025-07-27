import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IPago } from "../Interfaces/IPago";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Card,
  CardBody,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash, FaMoneyCheckAlt } from "react-icons/fa";

export function ListaPagos() {
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [busqueda, setBusqueda] = useState("");

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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Pagos/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          await obtenerPagos();
          Swal.fire("Eliminado", "El pago ha sido eliminado", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el pago", "error");
        }
      }
    });
  };

  const pagosFiltrados = pagos.filter((pago) =>
    pago.nombreCliente.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        <Col sm={{ size: 10, offset: 1 }}>
          <Card
            style={{
              borderRadius: "18px",
              boxShadow: "0 4px 24px #23272f33",
              border: "none",
              background: "linear-gradient(135deg, #f8fafc 80%, #e3e3e3 100%)",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#23272f",
                    fontWeight: "bold",
                  }}
                >
                  <FaMoneyCheckAlt size={28} color="#1b5e20" />
                  <h4 style={{ margin: 0 }}>Lista de Pagos</h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevopago"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #1b5e2022",
                  }}
                >
                  Nuevo Pago
                </Link>
              </div>

              <Row className="mb-3 align-items-center">
                <Col md="6"></Col>
                <Col md="6" className="text-end">
                  <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                    <InputGroupText style={{ background: "#fff" }}>
                      <FaSearch color="#1b5e20" />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por cliente..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{
                        borderRadius: "0 24px 24px 0",
                        borderLeft: "none",
                        background: "#fff",
                      }}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <div style={{ overflowX: "auto" }}>
                <Table
                  bordered
                  responsive
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px #23272f22",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ background: "#1b5e20", color: "#fff" }}>
                    <tr>
                      <th>Id</th>
                      <th>Fecha Pago</th>
                      <th>Monto</th>
                      <th>Método Pago</th>
                      <th>Número-Factura</th>
                      <th>Cliente</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosFiltrados.length > 0 ? (
                      pagosFiltrados.map((pago) => (
                        <tr key={pago.idPago}>
                          <td>{pago.idPago}</td>
                          <td>{formatearFecha(pago.fechaPago)}</td>
                          <td>{pago.monto.toFixed(2)}</td>
                          <td>{pago.metodoPago}</td>
                          <td>{pago.idFactura}</td>
                          <td>{pago.nombreCliente}</td>
                          <td className="text-center">
                            <Link
                              className="btn btn-primary me-2"
                              to={`editarpago/${pago.idPago}`}
                              style={{
                                borderRadius: "18px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 8px #23272f22",
                              }}
                            >
                              <FaEdit className="me-1" />
                              Editar
                            </Link>
                            <Button
                              color="danger"
                              onClick={() => Eliminar(pago.idPago)}
                              style={{
                                borderRadius: "18px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 8px #1b5e2022",
                              }}
                            >
                              <FaTrash className="me-1" />
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No se encontraron pagos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
