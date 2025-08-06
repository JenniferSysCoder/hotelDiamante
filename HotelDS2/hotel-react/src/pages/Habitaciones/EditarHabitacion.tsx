import { useEffect, useState, type ChangeEvent } from "react";
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
  idHabitacion: 0,
  numero: "",
  tipo: "",
  precioNoche: 0,
  estado: "Disponible",
  idHotel: 0,
  nombreHotel: "",
};

interface Props {
  idHabitacion: number;
  onClose: () => void;
  onSave: () => void;
}

export function EditarHabitacionModal({ idHabitacion, onClose, onSave }: Props) {
  const [habitacion, setHabitacion] = useState<IHabitacion>(initialHabitacion);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);

  useEffect(() => {
    const obtenerHabitacion = async () => {
      const response = await fetch(`${appsettings.apiUrl}Habitaciones/Obtener/${idHabitacion}`);
      if (response.ok) {
        const data = await response.json();
        setHabitacion(data);
      } else {
        Swal.fire("Error", "No se pudo cargar la habitación", "error");
      }
    };

    const obtenerHoteles = async () => {
      const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      }
    };

    obtenerHabitacion();
    obtenerHoteles();
  }, [idHabitacion]);

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
      habitacion.idHotel <= 0
    ) {
      Swal.fire("Faltan datos", "Completa todos los campos correctamente", "warning");
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Habitaciones/Editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitacion),
    });

    if (response.ok) {
      Swal.fire("Actualizado", "Habitación actualizada correctamente", "success");
      onClose();
      onSave();
    } else {
      Swal.fire("Error", "No se pudo editar la habitación", "error");
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <FaBed className="me-2 text-primary" /> Editar Habitación
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
