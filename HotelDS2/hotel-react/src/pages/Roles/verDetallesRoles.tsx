import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IRol } from "../../Interfaces/IRol";

interface Props {
  idRol: number;
  isOpen: boolean;
  onClose: () => void;
}

export function VerDetalleRolModal({ idRol, isOpen, onClose }: Props) {
  const [rol, setRol] = useState<IRol | null>(null);

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Roles/Obtener/${idRol}`);
        if (!response.ok) throw new Error("No se pudo obtener el rol");
        const data = await response.json();
        setRol(data);
      } catch (error) {
        Swal.fire("Error", "No se pudo obtener el detalle del rol", "error");
      }
    };

    if (idRol) fetchRol();
  }, [idRol]);

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        Detalles del Rol
      </ModalHeader>
      <ModalBody>
        {rol ? (
          <div style={{ padding: "10px 5px" }}>
            <Row className="mb-3">
              <Col xs={4} style={{ fontWeight: "bold", color: "#23272f" }}>
                ID:
              </Col>
              <Col xs={8}>{rol.idRol}</Col>
            </Row>
            <Row className="mb-3">
              <Col xs={4} style={{ fontWeight: "bold", color: "#23272f" }}>
                Nombre:
              </Col>
              <Col xs={8}>{rol.nombre}</Col>
            </Row>
            <Row className="mb-3">
              <Col xs={4} style={{ fontWeight: "bold", color: "#23272f" }}>
                Descripción:
              </Col>
              <Col xs={8}>{rol.descripcion || "Sin descripción"}</Col>
            </Row>
          </div>
        ) : (
          <p className="text-muted">Cargando datos del rol...</p>
        )}
      </ModalBody>
    </Modal>
  );
}
