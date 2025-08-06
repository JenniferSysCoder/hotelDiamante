import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useEffect, useState, type ChangeEvent } from "react";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../../Interfaces/IFactura";
import type { IServicio } from "../../Interfaces/IServicio";
import type { IReserva } from "../../Interfaces/IReserva";
import type { ICliente } from "../../Interfaces/ICliente";
import { FaEdit } from "react-icons/fa";

interface Props {
  idFactura: number;
  onClose: () => void;
}

export function EditarFacturaModal({ idFactura, onClose }: Props) {
  const [factura, setFactura] = useState<IFactura & { idCliente: number }>({
    idFactura: 0,
    fechaEmision: "",
    total: 0,
    idServicio: 0,
    idReserva: 0,
    nombreServicio: "",
    nombreCliente: "",
    numeroHabitacion: "",
    idCliente: 0,
  });
  const [servicios, setServicios] = useState<IServicio[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);

  const reservasFiltradas = reservas.filter(
    (r) => r.idCliente === factura.idCliente
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [fRes, sRes, rRes, cRes] = await Promise.all([
          fetch(`${appsettings.apiUrl}Facturas/Obtener/${idFactura}`),
          fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`),
          fetch(`${appsettings.apiUrl}Reservas/Lista`),
          fetch(`${appsettings.apiUrl}Clientes/Lista`),
        ]);

        const fData = await fRes.json();
        const sData = await sRes.json();
        const rData = await rRes.json();
        const cData = await cRes.json();

        const cliente = cData.find(
          (c: ICliente) => c.nombre === fData.nombreCliente
        ) || rData.find((r: IReserva) => r.idReserva === fData.idReserva);

        setFactura({
          ...fData,
          idCliente: cliente?.idCliente || 0,
        });

        setServicios(sData);
        setReservas(rData);
        setClientes(cData);
      } catch {
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };

    cargarDatos();
  }, [idFactura]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "idCliente") {
      const cliente = clientes.find((c) => c.idCliente === Number(value));
      setFactura((prev) => ({
        ...prev,
        idCliente: Number(value),
        nombreCliente: cliente?.nombre || "",
        idReserva: 0,
        numeroHabitacion: "",
      }));
    } else if (name === "idReserva") {
      const reserva = reservas.find((r) => r.idReserva === Number(value));
      setFactura((prev) => ({
        ...prev,
        idReserva: Number(value),
        numeroHabitacion: reserva?.numeroHabitacion ?? "",
      }));
    } else if (name === "idServicio") {
      const servicio = servicios.find((s) => s.idServicio === Number(value));
      setFactura((prev) => ({
        ...prev,
        idServicio: Number(value),
        nombreServicio: servicio?.nombre ?? "",
      }));
    }
  };

  const guardar = async () => {
    const response = await fetch(`${appsettings.apiUrl}Facturas/Editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(factura),
    });

    if (response.ok) {
      Swal.fire("Actualizado", "Factura actualizada correctamente", "success");
      onClose();
    } else {
      Swal.fire("Error", "No se pudo actualizar la factura", "error");
    }
  };

  return (
    <Modal isOpen centered size="lg">
      <ModalHeader toggle={onClose}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-info-subtle d-flex justify-content-center align-items-center"
            style={{ width: 32, height: 32 }}
          >
            <FaEdit color="#0277bd" />
          </div>
          <span className="fw-bold">Editar Factura</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha de Emisión</Label>
                <Input value={factura.fechaEmision} readOnly disabled />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Total</Label>
                <Input value={factura.total} readOnly />
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
              <option value={0}>Seleccione un servicio</option>
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
              value={factura.idCliente}
              onChange={inputChangeValue}
            >
              <option value={0}>Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombre}
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
              disabled={factura.idCliente === 0}
            >
              <option value={0}>Seleccione una reserva</option>
              {reservasFiltradas.map((r) => (
                <option key={r.idReserva} value={r.idReserva}>
                  {`Reserva #${r.idReserva} - Habitación ${r.numeroHabitacion}`}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Habitación</Label>
            <Input value={factura.numeroHabitacion} readOnly />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar}>
          Guardar
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
