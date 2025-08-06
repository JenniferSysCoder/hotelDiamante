import { useState, type ChangeEvent } from "react";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IServicio } from "../../Interfaces/IServicio";
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
import { FaSave, FaConciergeBell } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const initialServicio: IServicio = {
  idServicio: 0,
  nombre: "",
  descripcion: "",
  precio: 0,
};

export function NuevoServicioModal({ isOpen, onClose, onSave }: Props) {
  const [servicio, setServicio] = useState<IServicio>(initialServicio);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue =
      inputName === "precio" ? Number(event.target.value) : event.target.value;

    setServicio({ ...servicio, [inputName]: inputValue });
  };

  const guardar = async () => {
    if (!servicio.nombre.trim()) {
      Swal.fire("Faltan datos", "El nombre es obligatorio", "warning");
      return;
    }
    if (!servicio.descripcion?.trim()) {
      Swal.fire("Faltan datos", "La descripción es obligatoria", "warning");
      return;
    }
    if (servicio.precio <= 0) {
      Swal.fire("Faltan datos", "El precio debe ser mayor a cero", "warning");
      return;
    }

    try {
      const response = await fetch(
        `${appsettings.apiUrl}ServiciosAdicionales/Nuevo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(servicio),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await Swal.fire(
          "¡Guardado!",
          "El servicio se guardó correctamente.",
          "success"
        );
        onSave();
        onClose();
      } else {
        Swal.fire(
          "Error",
          data.mensaje || "No se pudo guardar el servicio",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al conectar con el servidor",
        "error"
      );
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="md">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <FaConciergeBell className="me-2 text-primary" />
        Nuevo Servicio
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              type="text"
              name="nombre"
              id="nombre"
              value={servicio.nombre}
              onChange={inputChangeValue}
              placeholder="Nombre del servicio"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              type="text"
              name="descripcion"
              id="descripcion"
              value={servicio.descripcion}
              onChange={inputChangeValue}
              placeholder="Descripción breve"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="precio">Precio</Label>
            <Input
              type="number"
              name="precio"
              id="precio"
              value={servicio.precio}
              onChange={inputChangeValue}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </FormGroup>
        </Form>
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
