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
import { FaBroom, FaSave, FaTimes, FaEdit } from "react-icons/fa";
import type { ILimpieza } from "../../Interfaces/ILimpieza";
import type { IEmpleado } from "../../Interfaces/IEmpleado";
import type { IHabitacion } from "../../Interfaces/IHabitacion";

interface Props {
  idLimpieza: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const initialLimpieza: ILimpieza = {
  idLimpieza: 0,
  fecha: "",
  observaciones: "",
  idEmpleado: 0,
  idHabitacion: 0,
  nombreEmpleado: "",
  numeroHabitacion: "",
};

export function EditarLimpiezaModal({ idLimpieza, isOpen, onClose, onSave }: Props) {
  const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [limpiezaRes, empleadosRes, habitacionesRes] = await Promise.all([
          fetch(`${appsettings.apiUrl}Limpiezas/Obtener/${idLimpieza}`),
          fetch(`${appsettings.apiUrl}Empleados/Lista`),
          fetch(`${appsettings.apiUrl}Habitaciones/Lista`),
        ]);

        if (!limpiezaRes.ok || !empleadosRes.ok || !habitacionesRes.ok) {
          throw new Error("Error al obtener datos");
        }

        const [limpiezaData, empleadosData, habitacionesData] = await Promise.all([
          limpiezaRes.json(),
          empleadosRes.json(),
          habitacionesRes.json(),
        ]);

        setLimpieza(limpiezaData);
        setEmpleados(empleadosData);
        setHabitaciones(habitacionesData);
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la limpieza", "error");
        onClose();
      }
    };

    if (idLimpieza > 0) {
      fetchData();
    }
  }, [idLimpieza]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLimpieza({
      ...limpieza,
      [name]: name === "idEmpleado" || name === "idHabitacion" ? Number(value) : value,
    });
  };

  const guardar = async () => {
    if (
      limpieza.idEmpleado === 0 ||
      limpieza.idHabitacion === 0 ||
      limpieza.fecha.trim() === ""
    ) {
      Swal.fire("Campos obligatorios", "Complete todos los campos", "warning");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Limpiezas/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(limpieza),
      });

      if (response.ok) {
        Swal.fire("Actualizado", "Limpieza actualizada correctamente", "success");
        onSave();
        onClose();
      } else {
        Swal.fire("Error", "No se pudo actualizar la limpieza", "error");
      }
    } catch {
      Swal.fire("Error", "Error al conectar con el servidor", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <span className="position-relative me-2">
          <FaBroom className="text-primary" />
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
        Editar Limpieza
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  name="fecha"
                  value={limpieza.fecha}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Observaciones</Label>
                <Input
                  type="text"
                  name="observaciones"
                  value={limpieza.observaciones}
                  onChange={inputChangeValue}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Habitación</Label>
                <Input
                  type="select"
                  name="idHabitacion"
                  value={limpieza.idHabitacion}
                  onChange={inputChangeValue}
                >
                  <option value={0}>Seleccione una habitación</option>
                  {habitaciones.map((h) => (
                    <option key={h.idHabitacion} value={h.idHabitacion}>
                      {h.numero}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Empleado</Label>
                <Input
                  type="select"
                  name="idEmpleado"
                  value={limpieza.idEmpleado}
                  onChange={inputChangeValue}
                >
                  <option value={0}>Seleccione un empleado</option>
                  {empleados.map((e) => (
                    <option key={e.idEmpleado} value={e.idEmpleado}>
                      {e.nombre}
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
          <FaTimes className="me-2" />
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
