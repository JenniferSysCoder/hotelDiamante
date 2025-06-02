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
} from "reactstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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
          <h4>Lista de usuarios</h4>
          <hr />

          <Row className="mb-3 align-items-center">
            <Col md="6">
              <Link className="btn btn-success" to="nuevousuario">
                Nuevo Usuario
              </Link>
            </Col>
            <Col md="6" className="text-end">
              <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                <InputGroupText>
                  <FaSearch />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Buscar por usuario..."
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
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.usuario1}</td>
                  <td>{usuario.contrasenia ?? "N/A"}</td>
                  <td className="text-center d-flex justify-content-center">
                    <Link
                      className="btn btn-primary me-2 d-inline-flex align-items-center"
                      to={`editarusuario/${usuario.id}`}
                    >
                      <FaEdit className="me-1" />
                      Editar
                    </Link>
                    <Button
                      color="danger"
                      onClick={() => eliminar(usuario.id)}
                      className="d-inline-flex align-items-center"
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
