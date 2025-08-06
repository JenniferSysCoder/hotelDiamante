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
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IServicio } from "../../Interfaces/IServicio";
import Swal from "sweetalert2";
import { FaSave, FaEdit } from "react-icons/fa";

interface Props {
  idServicio: number;
  onClose: () => void;
  onSave: () => void;
  isOpen: boolean;
}

export function EditarServicioModal({ idServicio, onClose, onSave, isOpen }: Props) {
  const [servicio, setServicio] = useState<IServicio | null>(null);

  useEffect(() => {
    const obtenerServicio = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Obtener/${idServicio}`);
        if (response.ok) {
          const data = await response.json();
          setServicio(data);
        } else {
          Swal.fire("Error", "No se pudo obtener el servicio", "error");
          onClose();
        }
      } catch {
        Swal.fire("Error", "Error de conexión", "error");
        onClose();
      }
    };

    if (idServicio > 0 && isOpen) {
      obtenerServicio();
    }
  }, [idServicio, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!servicio) return;
    const { name, value } = e.target;
    setServicio({ ...servicio, [name]: name === "precio" ? Number(value) : value });
  };

  const guardar = async () => {
    if (!servicio) return;

    if (!servicio.nombre.trim() || !servicio.descripcion?.trim() || servicio.precio <= 0) {
      Swal.fire("Campos inválidos", "Completa todos los campos correctamente", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicio),
      });

      if (response.ok) {
        await Swal.fire("Actualizado", "Servicio actualizado correctamente", "success");
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.mensaje || "No se pudo actualizar el servicio", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <FaEdit className="me-2 text-primary" />
        Editar Servicio
      </ModalHeader>
      <ModalBody>
        {servicio && (
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={servicio.nombre}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <Input
                type="text"
                name="descripcion"
                value={servicio.descripcion || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Precio</Label>
              <Input
                type="number"
                name="precio"
                value={servicio.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormGroup>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar} className="fw-bold">
          <FaSave className="me-2" /> Guardar
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
