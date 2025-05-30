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
} from "reactstrap";
import { FaSearch } from "react-icons/fa";

export function ListaPagos() {
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerPagos = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Pagos/Lista`);
      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos de la API:", data);
        if (Array.isArray(data)) {
          setPagos(data);
        } else {
          Swal.fire("Error", "Formato de datos inesperado", "error");
        }
      } else {
        console.error("Error al obtener pagos:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de pagos", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener pagos:", error);
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
      console.error("Fecha inválida:", fecha);
      return "Fecha inválida";
    }
    return fechaObj.toLocaleDateString();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <h4>Lista de Pagos</h4>
          <hr />
          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevopago">
                Nuevo Pago
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por cliente..."
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
                <th>Fecha Pago</th>
                <th>Monto</th>
                <th>Metodo Pago</th>
                <th>Número-Factura</th>
                <th>Cliente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.length > 0 ? (
                pagosFiltrados.map((pago) => (
                  <tr key={pago.idPago}>
                    <td>{pago.idPago}</td>
                    <td>{formatearFecha(pago.fechaPago)}</td>
                    <td>{pago.monto}</td>
                    <td>{pago.metodoPago}</td>
                    <td>{pago.idFactura}</td>
                    <td>{pago.nombreCliente}</td>
                    <td>
                      <Link
                        className="btn btn-primary me-2"
                        to={`editarpago/${pago.idPago}`}
                      >
                        Editar
                      </Link>
                      <Button
                        color="danger"
                        onClick={() => Eliminar(pago.idPago)}
                      >
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
        </Col>
      </Row>
    </Container>
  );
}
