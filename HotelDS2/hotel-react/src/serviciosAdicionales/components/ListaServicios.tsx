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
  Card,
  CardBody,
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash, FaConciergeBell } from "react-icons/fa";

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

  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
                    color: "#23272f",
                    fontWeight: "bold",
                  }}
                >
                  <FaConciergeBell size={28} color="#1b5e20" />
                  <h4 style={{ margin: 0 }}>Lista de Servicios</h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevoservicio"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #1b5e2022",
                  }}
                >
                  Nuevo Servicio
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
                  <thead style={{ background: "#1b5e20", color: "#fff" }}>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviciosFiltrados.length > 0 ? (
                      serviciosFiltrados.map((servicio) => (
                        <tr key={servicio.idServicio}>
                          <td>{servicio.idServicio}</td>
                          <td>{servicio.nombre}</td>
                          <td>{servicio.descripcion ?? "N/A"}</td>
                          <td>${servicio.precio.toFixed(2)}</td>
                          <td className="text-center d-flex justify-content-center gap-2">
                            <Link
                              className="btn btn-primary"
                              to={`editarservicio/${servicio.idServicio}`}
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.85rem",
                                lineHeight: 1,
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
                              onClick={() => Eliminar(servicio.idServicio)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.85rem",
                                lineHeight: 1,
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
                        <td colSpan={5} className="text-center">
                          No se encontraron servicios
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
