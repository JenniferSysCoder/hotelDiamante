import { useState, useEffect, type ChangeEvent } from "react";
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
import { FaBed, FaSave, FaTimes } from "react-icons/fa";
import { appsettings } from "../../settings/appsettings";
import type { IHabitacion } from "../../Interfaces/IHabitacion";
import type { IHotel } from "../../Interfaces/IHotel";

const initialHabitacion: IHabitacion = {
  numero: "",
  tipo: "",
  precioNoche: 0,
  estado: "Disponible",
  idHotel: 0,
  idHabitacion: 0,
  nombreHotel: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function NuevaHabitacionModal({ isOpen, onClose, onSave }: Props) {
  const [habitacion, setHabitacion] = useState<IHabitacion>(initialHabitacion);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);

  useEffect(() => {
    const fetchHoteles = async () => {
      const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      }
    };
    fetchHoteles();
  }, []);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHabitacion({
      ...habitacion,
      [name]: name === "precioNoche" || name === "idHotel" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      !habitacion.numero.trim() ||
      !habitacion.tipo.trim() ||
      habitacion.precioNoche <= 0 ||
      habitacion.idHotel === 0
    ) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios", "warning");
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Habitaciones/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitacion),
    });

    if (response.ok) {
      Swal.fire("Éxito", "Habitación registrada correctamente", "success");
      setHabitacion(initialHabitacion);
      onClose();
      onSave();
    } else {
      const error = await response.json();
      Swal.fire("Error", error.mensaje || "No se pudo guardar", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <FaBed className="me-2 text-primary" /> Nueva Habitación
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Número</Label>
                <Input
                  type="text"
                  name="numero"
                  value={habitacion.numero}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Tipo</Label>
                <Input
                  type="text"
                  name="tipo"
                  value={habitacion.tipo}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Precio por noche</Label>
                <Input
                  type="number"
                  name="precioNoche"
                  value={habitacion.precioNoche}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Estado</Label>
                <Input
                  type="text"
                  name="estado"
                  value={habitacion.estado}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Hotel</Label>
            <Input
              type="select"
              name="idHotel"
              value={habitacion.idHotel}
              onChange={inputChangeValue}
            >
              <option value={0}>Seleccione un hotel</option>
              {hoteles.map((hotel) => (
                <option key={hotel.idHotel} value={hotel.idHotel}>
                  {hotel.nombre}
                </option>
              ))}
            </Input>
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
