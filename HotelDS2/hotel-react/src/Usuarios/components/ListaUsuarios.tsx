import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IUsuario } from "../Interfaces/IUsuario";
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
import { FaUsers, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

export function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Usuarios/Lista`);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de usuarios", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Eliminar usuario!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b71c1c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${appsettings.apiUrl}Usuarios/Eliminar/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await obtenerUsuarios();
          Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.usuario1.toLowerCase().includes(busqueda.toLowerCase())
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
                    color: "#b71c1c",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                  }}
                >
                  <FaUsers size={28} />
                  <h4 style={{ margin: 0 }}>Lista de Usuarios</h4>
                </div>
                <Link
                  to="nuevousuario"
                  className="btn btn-success"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "24px",
                    boxShadow: "0 2px 8px #b71c1c22",
                  }}
                >
                  Nuevo Usuario
                </Link>
              </div>

              <Row className="mb-3 align-items-center">
                <Col md="6"></Col>
                <Col md="6" className="text-end">
                  <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                    <InputGroupText
                      style={{
                        background: "#fff",
                        color: "#b71c1c",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaSearch />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por usuario..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{
                        borderRadius: "0 24px 24px 0",
                        borderLeft: "none",
                        background: "#fff",
                        fontWeight: "500",
                        outline: "none",
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
                  <thead style={{ backgroundColor: "#b71c1c", color: "#fff" }}>
                    <tr>
                      <th style={{ fontWeight: "600" }}>Id</th>
                      <th style={{ fontWeight: "600" }}>Usuario</th>
                      <th style={{ fontWeight: "600" }}>Contraseña</th>
                      <th className="text-center" style={{ fontWeight: "600" }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center" style={{ color: "#999" }}>
                          No se encontraron usuarios.
                        </td>
                      </tr>
                    ) : (
                      usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>
                            <span
                              style={{
                                background: "#fbe9e7",
                                color: "#b71c1c",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                padding: "2px 10px",
                              }}
                            >
                              {usuario.usuario1}
                            </span>
                          </td>
                          <td>{usuario.contrasenia ?? "N/A"}</td>
                          <td className="text-center d-flex justify-content-center gap-2">
  <Link
    to={`editarusuario/${usuario.id}`}
    style={{
      backgroundColor: "#1976d2",
      color: "#fff",
      padding: "8px 18px",
      borderRadius: "24px", // más redondeado
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      textDecoration: "none",
      fontWeight: "600",
      boxShadow: "0 2px 8px #1976d222",
      transition: "background 0.2s, color 0.2s"
    }}
  >
    <FaEdit />
    Editar
  </Link>
  <Button
    color="danger"
    onClick={() => eliminar(usuario.id)}
    style={{
      borderRadius: "24px", // más redondeado
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: "600",
      padding: "8px 18px",
      boxShadow: "0 2px 8px #b71c1c22",
      transition: "background 0.2s, color 0.2s"
    }}
  >
    <FaTrash />
    Eliminar
  </Button>
</td>
                        </tr>
                      ))
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