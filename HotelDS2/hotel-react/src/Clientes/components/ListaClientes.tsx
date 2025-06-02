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
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

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
          <h4>Lista de clientes</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevocliente">
                Nuevo Cliente
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por nombre..."
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
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.documento}</td>
                  <td>{cliente.correo ?? "N/A"}</td>
                  <td>{cliente.telefono ?? "N/A"}</td>
                  <td className="text-center">
                    <Link
                      className="btn btn-primary me-2"
                      to={`editarcliente/${cliente.idCliente}`}
                    >
                      <FaEdit className="me-1" />
                      Editar
                    </Link>
                    <Button
                      color="danger"
                      onClick={() => Eliminar(cliente.idCliente!)}
                    >
                      <FaTrash className="me-1" />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
