import { useEffect, useState, type ChangeEvent } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import { appsettings } from "../../settings/appsettings";
import { FaMoneyCheckAlt, FaSave } from "react-icons/fa";
import type { IPago } from "../../Interfaces/IPago";
import type { IFactura } from "../../Interfaces/IFactura";

const initialPago: IPago = {
  idPago: 0,
  fechaPago: "",
  monto: 0,
  metodoPago: "",
  idFactura: 0,
  nombreCliente: "",
  numeroFacturaHabitacion: "",
};

interface NuevoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function NuevoPagoModal({ isOpen, onClose, onSave }: NuevoPagoModalProps) {
  const [pago, setPago] = useState<IPago>(initialPago);
  const [facturas, setFacturas] = useState<IFactura[]>([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Facturas/Lista`);
        const data = await response.json();
        setFacturas(data);
      } catch {
        Swal.fire("Error", "No se pudo cargar la lista de facturas", "error");
      }
    };
    if (isOpen) {
      fetchFacturas();
      setPago(initialPago);
    }
  }, [isOpen]);

  const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "idFactura") {
      const id = Number(value);
      const factura = facturas.find((f) => f.idFactura === id);
      setPago({ ...pago, idFactura: id, monto: factura ? factura.total : 0 });
    } else {
      setPago({ ...pago, [name]: value });
    }
  };

  const guardar = async () => {
    if (!pago.fechaPago || pago.idFactura === 0 || pago.monto <= 0 || !pago.metodoPago.trim()) {
      Swal.fire("Faltan datos", "Complete todos los campos", "warning");
      return;
    }

    const response = await fetch(`${appsettings.apiUrl}Pagos/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pago),
    });

    if (response.ok) {
      Swal.fire("Guardado", "Pago registrado correctamente", "success");
      onSave();
      onClose();
    } else {
      const errorText = await response.text();
      Swal.fire("Error", errorText, "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose} className="bg-white text-dark border-bottom">
        <FaMoneyCheckAlt className="me-2 text-primary" />
        Nuevo Pago
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Fecha de Pago</Label>
                <Input type="date" name="fechaPago" value={pago.fechaPago} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Monto</Label>
                <Input type="number" name="monto" value={pago.monto} readOnly />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Método de Pago</Label>
                <Input type="text" name="metodoPago" value={pago.metodoPago} onChange={inputChangeValue} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Factura</Label>
                <Input type="select" name="idFactura" value={pago.idFactura} onChange={inputChangeValue}>
                  <option value={0}>Seleccione una factura</option>
                  {facturas.map((f) => (
                    <option key={f.idFactura} value={f.idFactura}>
                      {f.nombreCliente} - #{f.idFactura}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
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
