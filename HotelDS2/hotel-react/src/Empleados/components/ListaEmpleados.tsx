import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IEmpleado } from "../Interfaces/IEmpleado";
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
import { FaSearch, FaUsers, FaEdit, FaTrash } from "react-icons/fa";

export function ListaEmpleado() {
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
      } else {
        console.error("Error al obtener empleados:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de empleados", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener empleados:", error);
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar empleado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Empleados/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          await obtenerEmpleados();
          Swal.fire("Eliminado", "Empleado eliminado correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el empleado", "error");
        }
      }
    });
  };

  const empleadosFiltrados = empleados.filter((emp) =>
    emp.nombre?.toLowerCase().includes(busqueda.toLowerCase())
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
                  <FaUsers size={28} color="#b71c1c" />
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: "#23272f",
                    }}
                  >
                    Lista de empleados
                  </h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevoempleado"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nuevo Empleado
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
                      <th>Teléfono</th>
                      <th>Cargo</th>
                      <th>Hotel</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleadosFiltrados.map((emp) => (
                      <tr key={emp.idEmpleado}>
                        <td>{emp.idEmpleado}</td>
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
                            {emp.nombre}
                          </span>
                        </td>
                        <td>{emp.apellido}</td>
                        <td>{emp.telefono ?? "N/D"}</td>
                        <td>{emp.cargo}</td>
                        <td>{emp.nombreHotel ?? "N/D"}</td>
                        <td className="text-center">
                          <Link
                            className="btn btn-primary me-2"
                            to={`editarempleado/${emp.idEmpleado}`}
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
                            onClick={() => Eliminar(emp.idEmpleado)}
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
