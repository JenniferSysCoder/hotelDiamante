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
import type { IPago } from "../../Interfaces/IPago";
import type { IFactura } from "../../Interfaces/IFactura";
import { FaMoneyCheckAlt, FaSave, FaEdit } from "react-icons/fa";

const initialPago: IPago = {
  idPago: 0,
  fechaPago: "",
  monto: 0,
  metodoPago: "",
  idFactura: 0,
  nombreCliente: "",
  numeroFacturaHabitacion: "",
};

interface EditarPagoModalProps {
  idPago: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditarPagoModal({ idPago, isOpen, onClose, onSave }: EditarPagoModalProps) {
  const [pago, setPago] = useState<IPago>(initialPago);
  const [facturas, setFacturas] = useState<IFactura[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resPago, resFacturas] = await Promise.all([
          fetch(`${appsettings.apiUrl}Pagos/Obtener/${idPago}`),
          fetch(`${appsettings.apiUrl}Facturas/Lista`),
        ]);
        const pagoData = await resPago.json();
        const facturasData = await resFacturas.json();
        setPago(pagoData);
        setFacturas(facturasData);
      } catch {
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };
    if (isOpen && idPago) {
      fetchDatos();
    }
  }, [isOpen, idPago]);

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

    const response = await fetch(`${appsettings.apiUrl}Pagos/Editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pago),
    });

    if (response.ok) {
      Swal.fire("Actualizado", "Pago actualizado correctamente", "success");
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
        <span className="position-relative me-2">
          <FaMoneyCheckAlt className="text-primary" />
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
        Editar Pago
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
