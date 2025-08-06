import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import { FaUsersCog, FaSave, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import type { IRol } from "../../Interfaces/IRol";

interface Props {
  idRol: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditarRolModal({ idRol, isOpen, onClose, onSave }: Props) {
  const [rol, setRol] = useState<IRol>({ idRol: 0, nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Roles/Obtener/${idRol}`);
        if (!response.ok) throw new Error("No se pudo obtener el rol");
        const data = await response.json();
        setRol(data);
      } catch (error) {
        Swal.fire("Error", "No se pudo obtener el rol", "error");
      }
    };
    if (idRol) fetchRol();
  }, [idRol]);

  const inputChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRol({ ...rol, [name]: value });
  };

  const guardar = async () => {
    if (rol.nombre.trim() === "") {
      Swal.fire("Campos requeridos", "El nombre es obligatorio", "warning");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${appsettings.apiUrl}Roles/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rol),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Éxito", data.mensaje || "Rol actualizado correctamente", "success");
        onSave(); // recargar lista
        onClose(); // cerrar modal
      } else {
        Swal.fire("Error", data.mensaje || "No se pudo actualizar el rol", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión al editar rol", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader
        toggle={onClose}
        className="bg-white text-dark border-bottom"
      >
        <span className="position-relative me-2">
          <FaUsersCog className="text-primary" />
          <FaEdit
            className="position-absolute text-primary"
            style={{
              fontSize: "0.6rem",
              bottom: "-2px",
              right: "-2px",
              background: "white",
              borderRadius: "50%",
              padding: "1px",
            }}
          />
        </span>
        Editar Rol
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  value={rol.nombre}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #e6510011",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  type="text"
                  name="descripcion"
                  value={rol.descripcion || ""}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #e6510011",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <Button
          color="primary"
          onClick={guardar}
          disabled={loading}
          className="fw-bold rounded-pill me-2"
        >
          <FaSave className="me-2" />
          {loading ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          color="secondary"
          onClick={onClose}
          className="fw-bold rounded-pill"
        >
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
