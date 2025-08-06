import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import type { IUsuario } from "../../Interfaces/IUsuario";

interface Props {
  idUsuario: number;
  onClose: () => void;
}

export function VerDetalleUsuario({ idUsuario, onClose }: Props) {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Usuarios/Obtener/${idUsuario}`);
        if (!response.ok) {
          throw new Error("Error al obtener usuario");
        }
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        Swal.fire("Error", "No se pudo obtener el detalle del usuario", "error");
      }
    };

    if (idUsuario) fetchUsuario();
  }, [idUsuario]);

  return (
    <Modal isOpen={true} toggle={onClose} centered>
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        Detalle de Usuario
      </ModalHeader>
      <ModalBody>
        {usuario ? (
          <ListGroup flush>
            <ListGroupItem>
              <strong>ID:</strong> {usuario.idUsuario}
            </ListGroupItem>
            <ListGroupItem>
              <strong>Usuario:</strong> {usuario.usuario1}
            </ListGroupItem>
            <ListGroupItem>
              <strong>Rol:</strong> {usuario.rolNombre || "N/A"}
            </ListGroupItem>
            <ListGroupItem>
              <strong>Empleado asignado:</strong>{" "}
              {usuario.idEmpleado ? usuario.idEmpleado : "No asignado"}
            </ListGroupItem>
          </ListGroup>
        ) : (
          <p className="text-muted">Cargando detalles del usuario...</p>
        )}
        <Row className="mt-4">
          <Col className="text-end">
            <Button
              color="secondary"
              onClick={onClose}
              className="fw-bold rounded-pill"
            >
              <FaTimes className="me-2" />
              Cerrar
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
}
