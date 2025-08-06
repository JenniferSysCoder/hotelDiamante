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
import { FaBroom, FaSave, FaTimes } from "react-icons/fa";
import { appsettings } from "../../settings/appsettings";
import type { ILimpieza } from "../../Interfaces/ILimpieza";
import type { IHabitacion } from "../../Interfaces/IHabitacion";
import type { IEmpleado } from "../../Interfaces/IEmpleado";

const initialLimpieza: ILimpieza = {
  idLimpieza: 0,
  fecha: "",
  observaciones: "",
  idHabitacion: 0,
  idEmpleado: 0,
  nombreEmpleado: "",
  numeroHabitacion: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function NuevaLimpiezaModal({ isOpen, onClose, onSave }: Props) {
  const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
  const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const resHab = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
      const resEmp = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
      if (resHab.ok) setHabitaciones(await resHab.json());
      if (resEmp.ok) setEmpleados(await resEmp.json());
    };
    cargarDatos();
  }, []);

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLimpieza({
      ...limpieza,
      [name]:
        name === "idHabitacion" || name === "idEmpleado"
          ? Number(value)
          : value,
    });
  };

  const guardar = async () => {
    if (
      limpieza.idHabitacion === 0 ||
      limpieza.idEmpleado === 0 ||
      !limpieza.fecha
    ) {
      Swal.fire("Faltan datos", "Complete todos los campos requeridos", "warning");
      return;
    }

    const empleado = empleados.find(e => e.idEmpleado === limpieza.idEmpleado);
    const habitacion = habitaciones.find(h => h.idHabitacion === limpieza.idHabitacion);

    const data = {
      Fecha: limpieza.fecha,
      Observaciones: limpieza.observaciones,
      IdEmpleado: limpieza.idEmpleado,
      NombreEmpleado: empleado?.nombre || "",
      IdHabitacion: limpieza.idHabitacion,
      NumeroHabitacion: habitacion?.numero || "",
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}Limpiezas/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Limpieza registrada correctamente", "success");
        setLimpieza(initialLimpieza);
        onSave();
        onClose();
      } else {
        const texto = await response.text();
        Swal.fire("Error", texto, "error");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <FaBroom color="#0d6efd" className="me-2" /> Nueva Limpieza
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
                  placeholder="Opcional"
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
                  {habitaciones.map((hab) => (
                    <option key={hab.idHabitacion} value={hab.idHabitacion}>
                      {hab.numero}
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
                  {empleados.map((emp) => (
                    <option key={emp.idEmpleado} value={emp.idEmpleado}>
                      {emp.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button color="primary" onClick={guardar}>
              <FaSave className="me-2" />
              Guardar
            </Button>
            <Button color="secondary" onClick={onClose}>
              <FaTimes className="me-2" />
              Cancelar
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
