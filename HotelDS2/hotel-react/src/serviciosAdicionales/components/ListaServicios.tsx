import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IServicio } from "../Interfaces/IServicio";
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

export function ListaServicios() {
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerServicios = async () => {
    try {
      const response = await fetch(
        `${appsettings.apiUrl}ServiciosAdicionales/Lista`
      );
      if (response.ok) {
        const data = await response.json();
        setServicios(data);
      } else {
        console.error("Error al obtener servicios:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de servicios", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener servicios:", error);
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar servicio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}ServiciosAdicionales/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          await obtenerServicios();
          Swal.fire("Eliminado", "Servicio eliminado correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el servicio", "error");
        }
      }
    });
  };

  // Filtro por nombre
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <h4>Lista de Servicios</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevoservicio">
                Nuevo Servicio
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
                <th>Descripción</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.map((servicio) => (
                <tr key={servicio.idServicio}>
                  <td>{servicio.idServicio}</td>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.descripcion ?? "N/A"}</td>
                  <td>${servicio.precio.toFixed(2)}</td>
                  <td>
                    <Link
                      className="btn btn-primary me-2"
                      to={`editarservicio/${servicio.idServicio}`}
                    >
                      Editar
                    </Link>
                    <Button
                      color="danger"
                      onClick={() => Eliminar(servicio.idServicio)}
                    >
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
