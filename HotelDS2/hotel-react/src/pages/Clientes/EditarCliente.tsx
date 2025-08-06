import { useEffect, useState, type ChangeEvent } from "react";
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
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import { FaUserEdit } from "react-icons/fa";
import type { ICliente } from "../../Interfaces/ICliente";

const initialCliente: ICliente = {
  idCliente: 0,
  nombre: "",
  apellido: "",
  documento: "",
  correo: "",
  telefono: "",
};

interface EditarClienteModalProps {
  idCliente: number;
  onClose: () => void;
  onSave?: () => void; // opcional, si quieres refrescar la lista luego de guardar
}

export function EditarClienteModal({ idCliente, onClose, onSave }: EditarClienteModalProps) {
  const [cliente, setCliente] = useState<ICliente>(initialCliente);

  useEffect(() => {
    const obtenerCliente = async () => {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Obtener/${idCliente}`);
      if (response.ok) {
        const data = await response.json();
        setCliente(data);
      } else {
        Swal.fire("Error", "No se pudo obtener el cliente", "error");
      }
    };

    if (idCliente) {
      obtenerCliente();
    }
  }, [idCliente]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const guardar = async () => {
    if (
      !cliente.nombre.trim() ||
      !cliente.apellido.trim() ||
      !`${cliente.documento}`.trim() ||
      !cliente.correo?.trim() ||
      !cliente.telefono?.trim()
    ) {
      Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const responseText = await response.text();
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = { mensaje: responseText };
      }

      if (response.ok) {
        Swal.fire("Guardado", "Cliente actualizado correctamente", "success");
        onSave?.(); // refresca lista si se define
        onClose(); // cierra modal
      } else {
        Swal.fire("Error", parsedResponse.mensaje || "Error al guardar", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose} style={{ fontWeight: "bold", color: "#23272f" }}>
        {/* Changed the icon color to blue */}
        <FaUserEdit className="me-2" style={{ color: "#1976d2" }} />
        {idCliente === 0 ? "Nuevo Cliente" : "Editar Cliente"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  value={cliente.nombre}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Apellido</Label>
                <Input
                  type="text"
                  name="apellido"
                  value={cliente.apellido}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Documento</Label>
                <Input
                  type="text"
                  name="documento"
                  value={cliente.documento !== undefined && cliente.documento !== null ? String(cliente.documento) : ""}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Correo</Label>
                <Input
                  type="email"
                  name="correo"
                  value={cliente.correo}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Teléfono</Label>
                <Input
                  type="text"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar}>
          Guardar Cliente
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}