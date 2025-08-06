import { useState, useEffect, type ChangeEvent } from "react";
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
import Swal from "sweetalert2";
import { FaUserEdit } from "react-icons/fa";
import { appsettings } from "../../settings/appsettings";
import type { IEmpleado } from "../../Interfaces/IEmpleado";
import type { IHotel } from "../../Interfaces/IHotel";

const initialEmpleado: IEmpleado = {
  idEmpleado: 0,
  nombre: "",
  apellido: "",
  cargo: "",
  telefono: "",
  idHotel: 0,
  nombreHotel: "",
  documento: undefined,
};

interface EditarEmpleadoModalProps {
  idEmpleado: number;
  onClose: () => void;
}

export function EditarEmpleadoModal({ idEmpleado, onClose }: EditarEmpleadoModalProps) {
  const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
  const [hoteles, setHoteles] = useState<IHotel[]>([]);

  useEffect(() => {
    const obtenerEmpleado = async () => {
      if (idEmpleado === 0) {
        setEmpleado(initialEmpleado);
        return;
      }

      try {
        const response = await fetch(`${appsettings.apiUrl}Empleados/Obtener/${idEmpleado}`);
        if (response.ok) {
          const data = await response.json();
          setEmpleado(data);
        } else {
          Swal.fire("Error", "No se pudo obtener el empleado", "error");
        }
      } catch {
        Swal.fire("Error", "Hubo un problema de conexión", "error");
      }
    };

    const obtenerHoteles = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
        if (response.ok) {
          const data = await response.json();
          setHoteles(data);
        }
      } catch {
        Swal.fire("Error", "No se pudieron cargar los hoteles", "error");
      }
    };

    obtenerEmpleado();
    obtenerHoteles();
  }, [idEmpleado]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmpleado({ ...empleado, [name]: name === "idHotel" ? Number(value) : value });
  };

  const guardar = async () => {
    if (!empleado.nombre || !empleado.apellido || !empleado.cargo || !empleado.idHotel) {
      Swal.fire("Faltan datos", "Por favor completa todos los campos requeridos", "warning");
      return;
    }

    const url = empleado.idEmpleado === 0
      ? `${appsettings.apiUrl}Empleados/Nuevo`
      : `${appsettings.apiUrl}Empleados/Editar/${empleado.idEmpleado}`;

    const method = empleado.idEmpleado === 0 ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Éxito", data.mensaje || "Empleado guardado correctamente", "success");
        onClose();
      } else {
        Swal.fire("Error", data.mensaje || "Error al guardar empleado", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  return (
    <Modal isOpen={true} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <FaUserEdit className="me-2" style={{ color: "#1976d2" }} />
        {empleado.idEmpleado === 0 ? "Nuevo Empleado" : "Editar Empleado"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Nombre</Label>
                <Input type="text" name="nombre" value={empleado.nombre} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Apellido</Label>
                <Input type="text" name="apellido" value={empleado.apellido} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Cargo</Label>
                <Input type="text" name="cargo" value={empleado.cargo} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Teléfono</Label>
                <Input type="text" name="telefono" value={empleado.telefono} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Hotel</Label>
            <Input type="select" name="idHotel" value={empleado.idHotel} onChange={inputChangeValue}>
              <option value={0}>Seleccione un hotel</option>
              {hoteles.map((hotel) => (
                <option key={hotel.idHotel} value={hotel.idHotel}>
                  {hotel.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar}>Guardar</Button>
        <Button color="secondary" onClick={onClose}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
}
