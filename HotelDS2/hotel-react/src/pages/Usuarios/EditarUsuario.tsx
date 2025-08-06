import { useEffect, useState, type ChangeEvent } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import { FaSave, FaUser, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import type { IUsuario } from "../../Interfaces/IUsuario";

interface Props {
  isOpen: boolean;
  idUsuario: number;
  onClose: () => void;
  onSave: () => void;
}

interface Rol {
  idRol: number;
  nombre: string;
}

interface Empleado {
  idEmpleado: number;
  nombre: string;
  apellido: string;
}

const initialUsuario: IUsuario = {
  idUsuario: 0,
  usuario1: "",
  contrasena: "",
  idRol: 0,
  idEmpleado: null,
  rolNombre: "",
};

export function EditarUsuarioModal({ isOpen, idUsuario, onClose, onSave }: Props) {
  const [usuario, setUsuario] = useState<IUsuario>(initialUsuario);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${appsettings.apiUrl}Roles/Lista`)
        .then((res) => res.json())
        .then((data) => setRoles(data));

      fetch(`${appsettings.apiUrl}Empleados/Lista`)
        .then((res) => res.json())
        .then((data) => setEmpleados(data));

      fetch(`${appsettings.apiUrl}Usuarios/Obtener/${idUsuario}`)
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch(() =>
          Swal.fire("Error", "No se pudo obtener la información del usuario", "error")
        );
    }
  }, [isOpen, idUsuario]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const parsedValue =
      name === "idRol" || name === "idEmpleado" ? (value === "" ? null : Number(value)) : value;

    setUsuario({ ...usuario, [name]: parsedValue });
  };

  const guardar = async () => {
    if (usuario.usuario1.trim() === "" || (usuario.contrasena ?? "").trim() === "") {
      Swal.fire("Campos requeridos", "Por favor, completa todos los campos", "warning");
      return;
    }

    if (!usuario.idRol) {
      Swal.fire("Campos requeridos", "Por favor, selecciona un rol", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Usuarios/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      Swal.fire("Actualizado", "Usuario editado correctamente", "success");
      onSave();
      onClose();
    } catch (error) {
      Swal.fire("Error", "No se pudo editar el usuario", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" centered>
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <span className="position-relative me-2">
          <FaUser className="text-primary" />
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
        Editar Usuario
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Usuario</Label>
                <Input
                  name="usuario1"
                  value={usuario.usuario1}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #b71c1c11",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  name="contrasena"
                  value={usuario.contrasena ?? ""}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #b71c1c11",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Rol</Label>
                <Input
                  type="select"
                  name="idRol"
                  value={usuario.idRol || 0}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #b71c1c11",
                  }}
                >
                  <option value={0}>Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>
                      {rol.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Empleado (opcional)</Label>
                <Input
                  type="select"
                  name="idEmpleado"
                  value={usuario.idEmpleado ?? ""}
                  onChange={inputChangeValue}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 2px 8px #b71c1c11",
                  }}
                >
                  <option value="">Sin asignar</option>
                  {empleados.map((emp) => (
                    <option key={emp.idEmpleado} value={emp.idEmpleado}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar} className="fw-bold rounded-pill">
          <FaSave className="me-2" />
          Guardar
        </Button>
        <Button color="secondary" onClick={onClose} className="fw-bold rounded-pill">
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
