import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IPago } from "../Interfaces/IPago";
import type { IFactura } from "../../Facturas/Interfaces/IFactura";
import { FaMoneyCheckAlt, FaSave, FaArrowLeft } from "react-icons/fa";

const initialPago: IPago = {
  idPago: 0,
  fechaPago: "",
  monto: 0,
  metodoPago: "",
  idFactura: 0,
  nombreCliente: "",
  numeroFacturaHabitacion: "",
};

export function EditarPago() {
  const { id } = useParams<{ id: string }>();
  const [pago, setPago] = useState<IPago>(initialPago);
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [pagoRes, facturasRes] = await Promise.all([
          fetch(`${appsettings.apiUrl}Pagos/Obtener/${id}`),
          fetch(`${appsettings.apiUrl}Facturas/Lista`),
        ]);

        if (!pagoRes.ok || !facturasRes.ok) {
          throw new Error("Error al obtener los datos");
        }

        const pagoData = await pagoRes.json();
        const facturasData = await facturasRes.json();

        setPago(pagoData);
        setFacturas(facturasData);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [id]);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "idFactura") {
      const idFacturaSeleccionada = Number(value);
      const facturaSeleccionada = facturas.find(
        (f) => f.idFactura === idFacturaSeleccionada
      );

      setPago((prevPago) => ({
        ...prevPago,
        idFactura: idFacturaSeleccionada,
        monto: facturaSeleccionada ? facturaSeleccionada.total : 0,
      }));
    } else {
      setPago((prevPago) => ({
        ...prevPago,
        [name]: value,
      }));
    }
  };

  const guardar = async () => {
    if (
      pago.idFactura === 0 ||
      !pago.fechaPago.trim() ||
      pago.monto <= 0 ||
      !pago.metodoPago.trim()
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor complete todos los campos",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Pagos/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      });

      if (response.ok) {
        Swal.fire("Actualizado", "Pago actualizado correctamente", "success");
        navigate("/pagos");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.mensaje || "No se pudo editar el pago",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Error inesperado al actualizar el pago", "error");
    }
  };

  const volver = () => {
    navigate("/pagos");
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <Card
            style={{
              borderRadius: "18px",
              boxShadow: "0 4px 24px #23272f33",
              border: "none",
              background: "linear-gradient(135deg, #f8fafc 80%, #e3e3e3 100%)",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                  color: "#b71c1c",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                }}
              >
                <FaMoneyCheckAlt size={28} />
                <h4 style={{ margin: 0 }}>Editar Pago</h4>
              </div>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Fecha de Pago
                      </Label>
                      <Input
                        type="date"
                        name="fechaPago"
                        value={pago.fechaPago}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Monto
                      </Label>
                      <Input
                        type="number"
                        name="monto"
                        value={pago.monto}
                        readOnly
                        style={{
                          borderRadius: "12px",
                          background: "#f3f3f3",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Método de Pago
                      </Label>
                      <Input
                        type="text"
                        name="metodoPago"
                        value={pago.metodoPago}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label style={{ fontWeight: "bold", color: "#23272f" }}>
                        Factura
                      </Label>
                      <Input
                        type="select"
                        name="idFactura"
                        value={pago.idFactura}
                        onChange={inputChangeValue}
                        style={{
                          borderRadius: "12px",
                          background: "#fff",
                          boxShadow: "0 2px 8px #b71c1c11",
                        }}
                      >
                        <option value={0}>Seleccione una factura</option>
                        {facturas.map((factura) => (
                          <option key={factura.idFactura} value={factura.idFactura}>
                            {factura.nombreCliente} - Factura #{factura.idFactura}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button
                  color="danger"
                  className="me-2"
                  onClick={guardar}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #b71c1c22",
                    padding: "8px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaSave /> Guardar
                </Button>
                <Button
                  color="secondary"
                  onClick={volver}
                  style={{
                    borderRadius: "24px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px #23272f22",
                    padding: "8px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaArrowLeft /> Volver
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
