import { useEffect, useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";
import type { IFactura } from "../../Interfaces/IFactura";
import type { IServicio } from "../../Interfaces/IServicio";
import type { IReserva } from "../../Interfaces/IReserva";
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
import { appsettings } from "../../settings/appsettings";
import { FaFileInvoice } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const today = new Date().toISOString().split("T")[0];

const initialFactura: IFactura = {
  idFactura: 0,
  fechaEmision: today,
  total: 0,
  idServicio: 0,
  idReserva: 0,
  nombreServicio: "",
  nombreCliente: "",
  numeroHabitacion: "",
};

export function NuevaFacturaModal({ isOpen, onClose }: Props) {
  const [factura, setFactura] = useState<IFactura>(initialFactura);
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [clientes, setClientes] = useState<
    { idCliente: number; nombreCliente: string }[]
  >([]);
  const [reservasFiltradas, setReservasFiltradas] = useState<IReserva[]>([]);

  useEffect(() => {
    const fetchServicios = async () => {
      const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`);
      const data = await response.json();
      if (Array.isArray(data)) setServicios(data);
    };

    const fetchReservas = async () => {
      const response = await fetch(`${appsettings.apiUrl}Reservas/Lista`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setReservas(data);
        const clientesUnicos = data.reduce((acc: any[], r: IReserva) => {
          if (!acc.some((c) => c.idCliente === r.idCliente)) {
            acc.push({ idCliente: r.idCliente, nombreCliente: r.nombreCliente });
          }
          return acc;
        }, []);
        setClientes(clientesUnicos);
      }
    };

    fetchServicios();
    fetchReservas();
  }, []);

  const calcularTotal = async (idReserva: number, idServicio: number) => {
    if (idReserva > 0 && idServicio > 0) {
      const response = await fetch(
        `${appsettings.apiUrl}Facturas/CalcularTotal?idReserva=${idReserva}&idServicio=${idServicio}`
      );
      if (response.ok) {
        const data = await response.json();
        setFactura((prev) => ({ ...prev, total: data.totalCalculado }));
      }
    }
  };

  const inputChangeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "idCliente") {
      const idCliente = Number(value);
      const reservasCliente = reservas.filter((r) => r.idCliente === idCliente);
      setReservasFiltradas(reservasCliente);

      setFactura((prev) => ({
        ...prev,
        idReserva: 0,
        numeroHabitacion: "",
        nombreCliente:
          clientes.find((c) => c.idCliente === idCliente)?.nombreCliente ?? "",
      }));
      return;
    }

    const numericValue =
      name === "idServicio" || name === "idReserva" ? Number(value) : value;

    let updatedFactura = {
      ...factura,
      [name]: numericValue,
    };

    if (name === "idReserva") {
      const reservaSeleccionada = reservas.find((r) => r.idReserva === numericValue);
      updatedFactura.numeroHabitacion = reservaSeleccionada?.numeroHabitacion ?? "";
      updatedFactura.nombreCliente = reservaSeleccionada?.nombreCliente ?? "";
    }

    setFactura(updatedFactura);

    if (
      (name === "idServicio" && updatedFactura.idReserva > 0) ||
      (name === "idReserva" && updatedFactura.idServicio > 0)
    ) {
      calcularTotal(updatedFactura.idReserva, updatedFactura.idServicio);
    }
  };

  const guardar = async () => {
    if (factura.idServicio === 0 || factura.idReserva === 0) {
      Swal.fire("Faltan datos", "Complete todos los campos", "warning");
      return;
    }

    const facturaData = {
      fechaEmision: factura.fechaEmision,
      total: factura.total,
      idServicio: factura.idServicio,
      idReserva: factura.idReserva,
      numeroHabitacion: factura.numeroHabitacion,
    };

    const response = await fetch(`${appsettings.apiUrl}Facturas/Nueva`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaData),
    });

    if (response.ok) {
      Swal.fire("Éxito", "Factura registrada correctamente", "success");
      onClose();
    } else {
      Swal.fire("Error", "No se pudo guardar la factura", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-info-subtle d-flex justify-content-center align-items-center"
            style={{ width: 32, height: 32 }}
          >
            <FaFileInvoice color="#0277bd" />
          </div>
          <span className="fw-bold">Nueva Factura</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha de Emisión</Label>
                <Input type="text" value={factura.fechaEmision} readOnly disabled />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Total</Label>
                <Input type="number" value={factura.total} readOnly />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Servicio</Label>
            <Input
              type="select"
              name="idServicio"
              value={factura.idServicio}
              onChange={inputChangeValue}
            >
              <option value="0">Seleccione un servicio</option>
              {servicios.map((s) => (
                <option key={s.idServicio} value={s.idServicio}>
                  {s.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Cliente</Label>
            <Input
              type="select"
              name="idCliente"
              value={
                clientes.find((c) => c.nombreCliente === factura.nombreCliente)?.idCliente || 0
              }
              onChange={inputChangeValue}
            >
              <option value={0}>Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombreCliente}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Reserva</Label>
            <Input
              type="select"
              name="idReserva"
              value={factura.idReserva}
              onChange={inputChangeValue}
              disabled={factura.nombreCliente === ""}
            >
              <option value={0}>Seleccione una reserva</option>
              {reservasFiltradas.map((r) => (
                <option key={r.idReserva} value={r.idReserva}>
                  {`#${r.idReserva} - Hab: ${r.numeroHabitacion}`}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Habitación</Label>
            <Input type="text" value={factura.numeroHabitacion} readOnly />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar}>
          Guardar
        </Button>{" "}
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
