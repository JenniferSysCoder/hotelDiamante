import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { ICliente } from "../Interfaces/ICliente";
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
import { FaSearch, FaUser, FaEdit, FaTrash } from "react-icons/fa";

export function ListaClientes() {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerClientes = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Lista`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        console.error("Error al obtener clientes:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de clientes", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener clientes:", error);
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
        const response = await fetch(
          `${appsettings.apiUrl}Clientes/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );

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

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

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
                  <FaUser size={28} color="#b71c1c" />
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: "#23272f",
                    }}
                  >
                    Lista de clientes
                  </h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevocliente"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nuevo Cliente
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
                      placeholder="Buscar por nombre..."
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
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Documento</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.idCliente}>
                        <td>{cliente.idCliente}</td>
                        <td>
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
                            {cliente.nombre}
                          </span>
                        </td>
                        <td>{cliente.apellido}</td>
                        <td>{cliente.documento}</td>
                        <td>{cliente.correo ?? "N/A"}</td>
                        <td>{cliente.telefono ?? "N/A"}</td>
                        <td className="text-center">
                          <Link
                            className="btn btn-primary me-2"
                            to={`editarcliente/${cliente.idCliente}`}
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
                            onClick={() => Eliminar(cliente.idCliente!)}
                            style={{
                              borderRadius: "18px",
                              fontWeight: "bold",
                              boxShadow: "0 2px 8px #b71c1c22",
                            }}
                          >
                            <FaTrash className="me-1" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
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
