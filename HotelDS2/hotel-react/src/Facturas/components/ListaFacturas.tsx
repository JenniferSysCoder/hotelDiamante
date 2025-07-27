import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IFactura } from "../Interfaces/IFactura";
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
import { FaSearch, FaEdit, FaTrash, FaFileInvoice } from "react-icons/fa";

export function ListaFacturas() {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerFacturas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Facturas/Lista`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setFacturas(data);
        } else {
          Swal.fire("Error", "Formato de datos inesperado", "error");
        }
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de facturas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

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
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Facturas/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          await obtenerFacturas();
          Swal.fire("Eliminado", "La factura ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la factura", "error");
        }
      }
    });
  };

  const facturasFiltradas = facturas.filter(
    (factura) =>
      factura.nombreServicio.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.nombreCliente.toLowerCase().includes(busqueda.toLowerCase())
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
                  }}
                >
                  <FaFileInvoice size={28} color="#b71c1c" />
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: "#23272f",
                    }}
                  >
                    Lista de Facturas
                  </h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevafactura"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nueva Factura
                </Link>
              </div>

              <Row className="mb-3 align-items-center">
                <Col md="6"></Col>
                <Col md="6" className="text-end">
                  <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                    <InputGroupText style={{ background: "#fff" }}>
                      <FaSearch color="#b71c1c" />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por servicio o cliente..."
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
                  <thead style={{ background: "#b71c1c", color: "#fff" }}>
                    <tr>
                      <th className="text-center">Id</th>
                      <th className="text-center">Fecha Emisión</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Servicio</th>
                      <th className="text-center">Cliente</th>
                      <th className="text-center">Habitación</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasFiltradas.length > 0 ? (
                      facturasFiltradas.map((factura) => (
                        <tr key={factura.idFactura}>
                          <td className="text-center">{factura.idFactura}</td>
                          <td className="text-center">
                            {formatearFecha(factura.fechaEmision)}
                          </td>
                          <td className="text-center" style={{ color: "#388e3c", fontWeight: "bold" }}>
                            ${factura.total.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <span
                              style={{
                                background: "#fbe9e7",
                                color: "#b71c1c",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                padding: "2px 10px",
                                display: "inline-block",
                              }}
                            >
                              {factura.nombreServicio}
                            </span>
                          </td>
                          <td className="text-center">{factura.nombreCliente}</td>
                          <td className="text-center">{factura.numeroHabitacion}</td>
                          <td className="text-center">
                            <div
                              className="d-inline-flex justify-content-center align-items-center gap-1 flex-nowrap"
                              style={{ gap: "6px" }}
                            >
                              <Link
                                className="btn btn-primary d-inline-flex align-items-center"
                                to={`editarfactura/${factura.idFactura}`}
                                style={{
                                  fontSize: "0.85rem",
                                  whiteSpace: "nowrap",
                                  borderRadius: "18px",
                                  fontWeight: "bold",
                                  boxShadow: "0 2px 8px #23272f22",
                                  padding: "6px 12px",
                                }}
                              >
                                <FaEdit className="me-1" />
                                Editar
                              </Link>
                              <Button
                                color="danger"
                                onClick={() => Eliminar(factura.idFactura)}
                                style={{
                                  fontSize: "0.85rem",
                                  whiteSpace: "nowrap",
                                  borderRadius: "18px",
                                  fontWeight: "bold",
                                  boxShadow: "0 2px 8px #b71c1c22",
                                  padding: "6px 12px",
                                }}
                              >
                                <FaTrash className="me-1" />
                                Eliminar
                              </Button>
                              <Link
                                className="btn btn-secondary d-inline-flex align-items-center"
                                to={`verfactura/${factura.idFactura}`}
                                style={{
                                  fontSize: "0.85rem",
                                  whiteSpace: "nowrap",
                                  borderRadius: "18px",
                                  fontWeight: "bold",
                                  boxShadow: "0 2px 8px #88888822",
                                  padding: "6px 12px",
                                }}
                              >
                                <FaFileInvoice className="me-1" />
                                Generar Factura
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No se encontraron facturas
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
