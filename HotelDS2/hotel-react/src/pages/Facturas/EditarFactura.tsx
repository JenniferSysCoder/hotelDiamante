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
  const [loading, setLoading] = useState(false);

  const reservasFiltradas = reservas.filter(
    (r) => r.idCliente === factura.idCliente
  );

  // ---- helpers API
  const existePorReserva = async (idReserva: number, excluirId?: number) => {
    if (!idReserva) return false;
    try {
      const url = `${appsettings.apiUrl}Facturas/ExistePorReserva/${idReserva}${
        excluirId ? `?excluirId=${excluirId}` : ""
      }`;
      const resp = await fetch(url);
      if (!resp.ok) return false;
      const data = await resp.json();
      return typeof data === "boolean" ? data : !!data.existe;
    } catch {
      return false;
    }
  };

  const calcularTotal = async (idReservaCalc: number, idServicioCalc: number) => {
    if (idReservaCalc > 0 && idServicioCalc > 0) {
      try {
        const resp = await fetch(
          `${appsettings.apiUrl}Facturas/CalcularTotal?idReserva=${idReservaCalc}&idServicio=${idServicioCalc}`
        );
        if (resp.ok) {
          const data = await resp.json();
          setFactura((prev) => ({
            ...prev,
            total: Number(data.totalCalculado ?? prev.total),
            numeroHabitacion: data.numeroHabitacion ?? prev.numeroHabitacion,
            nombreCliente: data.nombreCliente ?? prev.nombreCliente,
            nombreServicio: data.nombreServicio ?? prev.nombreServicio,
          }));
        }
      } catch {
        // silencioso, no rompemos la edición si falla el cálculo
      }
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [fRes, sRes, rRes, cRes] = await Promise.all([
          fetch(`${appsettings.apiUrl}Facturas/Obtener/${idFactura}`),
          fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`),
          fetch(`${appsettings.apiUrl}Reservas/Lista`),
          fetch(`${appsettings.apiUrl}Clientes/Lista`),
        ]);

        if (!fRes.ok) throw new Error("No se pudo cargar la factura");

        const fData = await fRes.json();
        const sData = await sRes.json();
        const rData = await rRes.json();
        const cData = await cRes.json();

        // intenta mapear el cliente por nombre; si no, por la reserva asociada
        const clienteMatchPorNombre = Array.isArray(cData)
          ? cData.find(
              (c: ICliente) =>
                (c.nombre ?? (c as any).nombreCliente) === fData.nombreCliente
            )
          : undefined;

        const reservaFactura = Array.isArray(rData)
          ? rData.find((r: IReserva) => r.idReserva === fData.idReserva)
          : undefined;

        setFactura({
          ...fData,
          idCliente:
            clienteMatchPorNombre?.idCliente ??
            reservaFactura?.idCliente ??
            0,
        });

        setServicios(Array.isArray(sData) ? sData : []);
        setReservas(Array.isArray(rData) ? rData : []);
        setClientes(Array.isArray(cData) ? cData : []);
      } catch {
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idFactura]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "idCliente") {
      const idCliente = Number(value);
      const cliente = clientes.find((c) => c.idCliente === idCliente);
      setFactura((prev) => ({
        ...prev,
        idCliente,
        nombreCliente: (cliente?.nombre ?? (cliente as any)?.nombreCliente) || "",
        idReserva: 0,
        numeroHabitacion: "",
      }));
      return;
    }

    if (name === "idReserva") {
      const idReservaSel = Number(value);
      const reserva = reservas.find((r) => r.idReserva === idReservaSel);
      setFactura((prev) => {
        const actualizado = {
          ...prev,
          idReserva: idReservaSel,
          numeroHabitacion: reserva?.numeroHabitacion ?? "",
          nombreCliente: reserva?.nombreCliente ?? prev.nombreCliente,
          idCliente: reserva?.idCliente ?? prev.idCliente,
        };
        // recálculo si ya hay servicio seleccionado
        if (actualizado.idServicio > 0 && actualizado.idReserva > 0) {
          calcularTotal(actualizado.idReserva, actualizado.idServicio);
        }
        return actualizado;
      });
      return;
    }

    if (name === "idServicio") {
      const idServ = Number(value);
      const servicio = servicios.find((s) => s.idServicio === idServ);
      setFactura((prev) => {
        const actualizado = {
          ...prev,
          idServicio: idServ,
          nombreServicio: servicio?.nombre ?? "",
        };
        if (actualizado.idServicio > 0 && actualizado.idReserva > 0) {
          calcularTotal(actualizado.idReserva, actualizado.idServicio);
        }
        return actualizado;
      });
      return;
    }
  };

  const guardar = async () => {
    // Validaciones mínimas
    if (!factura.idCliente || !factura.idReserva || !factura.idServicio) {
      Swal.fire("Faltan datos", "Complete todos los campos requeridos.", "warning");
      return;
    }

    // Anti-duplicados por reserva (excluye la misma factura)
    const dup = await existePorReserva(factura.idReserva, factura.idFactura);
    if (dup) {
      Swal.fire(
        "No permitido",
        "Ya existe otra factura asociada a esta reserva.",
        "warning"
      );
      return;
    }

    // PUT editar
    try {
      const response = await fetch(`${appsettings.apiUrl}Facturas/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factura),
      });

      if (response.ok) {
        Swal.fire("Actualizado", "Factura actualizada correctamente", "success");
        onClose();
        return;
      }

      if (response.status === 409) {
        const txt = await response.text();
        Swal.fire(
          "Conflicto",
          txt && txt.length < 200
            ? txt
            : "Conflicto de duplicidad: ya existe una factura para esta reserva.",
          "error"
        );
        return;
      }

      const txt = await response.text();
      Swal.fire("Error", txt || "No se pudo actualizar la factura", "error");
    } catch {
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
              disabled={loading}
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
              disabled={loading}
            >
              <option value={0}>Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombre ?? (c as any).nombreCliente}
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
              disabled={loading || factura.idCliente === 0}
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
            <Input type="text" value={factura.numeroHabitacion} readOnly />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={guardar} disabled={loading}>
          Guardar
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
