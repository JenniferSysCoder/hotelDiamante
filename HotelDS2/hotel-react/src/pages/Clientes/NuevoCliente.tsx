import { type ChangeEvent, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
import { FaUser, FaSave, FaTimes } from "react-icons/fa";
import { appsettings } from "../../settings/appsettings";
import type { ICliente } from "../../Interfaces/ICliente";

const initialCliente: ICliente = {
  idCliente: 0,
  nombre: "",
  apellido: "",
  documento: "",
  correo: "",
  telefono: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NuevoClienteModal({ isOpen, onClose }: Props) {
  const [cliente, setCliente] = useState<ICliente>(initialCliente);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const validarCliente = (): string | null => {
    const { nombre, apellido, documento, correo, telefono } = cliente;

    if (
      !nombre?.trim() ||
      !apellido?.trim() ||
      !`${documento}`.trim() ||
      !correo?.trim() ||
      !telefono?.trim()
    ) {
      return "Todos los campos son obligatorios.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return "El correo electrónico no es válido.";
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(telefono)) {
      return "El teléfono debe contener entre 7 y 15 dígitos y solo números.";
    }

    return null;
  };

  const guardar = async () => {
    const error = validarCliente();
    if (error) {
      Swal.fire("Datos inválidos", error, "warning");
      return;
    }

    Swal.fire({
      title: "Guardando...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await fetch(`${appsettings.apiUrl}Clientes/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      let mensaje = "No se pudo guardar el cliente";

      try {
        const data = await response.json();
        mensaje = data?.mensaje || mensaje;
      } catch (_) {
        // No es JSON o error inesperado
      }

      if (response.ok) {
        Swal.fire("¡Éxito!", mensaje, "success");
        setCliente(initialCliente);
        onClose();
      } else {
        Swal.fire("Error", mensaje, "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor. Intenta más tarde.", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <FaUser color="#0d6efd" className="me-2" /> Nuevo Cliente
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

          <FormGroup>
            <Label>Teléfono</Label>
            <Input
              type="text"
              name="telefono"
              value={cliente.telefono}
              onChange={inputChangeValue}
            />
          </FormGroup>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button color="primary" onClick={guardar}>
              <FaSave className="me-2" /> Guardar
            </Button>
            <Button color="secondary" onClick={onClose}>
              <FaTimes className="me-2" /> Cancelar
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
