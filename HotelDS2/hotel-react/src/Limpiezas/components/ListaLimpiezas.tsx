import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { ILimpieza } from "../Interfaces/ILimpieza";
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
import { FaSearch, FaEdit, FaTrash, FaBroom } from "react-icons/fa";

export function ListaLimpieza() {
  const [limpiezas, setLimpiezas] = useState<ILimpieza[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerLimpiezas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Limpiezas/Lista`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setLimpiezas(data);
        } else {
          Swal.fire("Error", "Formato de datos inesperado", "error");
        }
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de limpiezas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerLimpiezas();
  }, []);

  const Eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar limpieza!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Limpiezas/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          await obtenerLimpiezas();
          Swal.fire("Eliminado", "La limpieza ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la limpieza", "error");
        }
      }
    });
  };

  const limpiezasFiltradas = limpiezas.filter((limpieza) =>
    limpieza.numeroHabitacion.toLowerCase().includes(busqueda.toLowerCase())
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
                  <FaBroom size={28} color="#b71c1c" />
                  <h4 style={{ margin: 0 }}>Lista de Limpiezas</h4>
                </div>
                <Link
                  className="btn btn-success"
                  to="nuevalimpieza"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nueva Limpieza
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
                      placeholder="Buscar por habitación..."
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
                      <th>Fecha</th>
                      <th>Observaciones</th>
                      <th>Habitación</th>
                      <th>Empleado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {limpiezasFiltradas.length > 0 ? (
                      limpiezasFiltradas.map((limpieza) => (
                        <tr key={limpieza.idLimpieza}>
                          <td>{limpieza.idLimpieza}</td>
                          <td>{formatearFecha(limpieza.fecha)}</td>
                          <td>{limpieza.observaciones}</td>
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
                              {limpieza.numeroHabitacion}
                            </span>
                          </td>
                          <td>{limpieza.nombreEmpleado}</td>
                          <td className="text-center">
                            <Link
                              className="btn btn-primary me-2"
                              to={`editarlimpieza/${limpieza.idLimpieza}`}
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
                              onClick={() => Eliminar(limpieza.idLimpieza)}
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No se encontraron limpiezas
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
