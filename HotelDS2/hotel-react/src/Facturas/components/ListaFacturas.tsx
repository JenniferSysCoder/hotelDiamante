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
} from "reactstrap";
import { FaSearch } from "react-icons/fa";

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
          <h4>Lista de Facturas</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevafactura">
                Nueva Factura
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por servicio o cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          <Table bordered responsive>
            <thead>
              <tr>
                <th>Id</th>
                <th>Fecha Emisión</th>
                <th>Total</th>
                <th>Servicio</th>
                <th>Cliente</th>
                <th>Habitación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.length > 0 ? (
                facturasFiltradas.map((factura) => (
                  <tr key={factura.idFactura}>
                    <td>{factura.idFactura}</td>
                    <td>{formatearFecha(factura.fechaEmision)}</td>
                    <td>{factura.total.toFixed(2)}</td>
                    <td>{factura.nombreServicio}</td>
                    <td>{factura.nombreCliente}</td>
                    <td>{factura.numeroHabitacion}</td>
                    <td>
                      <Link
                        className="btn btn-primary me-2"
                        to={`editarfactura/${factura.idFactura}`}
                      >
                        Editar
                      </Link>
                      <Button
                        color="danger"
                        onClick={() => Eliminar(factura.idFactura)}
                      >
                        Eliminar
                      </Button>
                      <Link
                        className="btn btn-secondary me-2"
                        to={`verfactura/${factura.idFactura}`}
                      >
                        Generar Factura
                      </Link>
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
        </Col>
      </Row>
    </Container>
  );
}
