import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IPago } from "../Interfaces/IPago";
import type { IFactura } from "../../Facturas/Interfaces/IFactura";
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
import { FaSave, FaArrowLeft, FaMoneyCheckAlt } from "react-icons/fa";

const initialPago: IPago = {
  idPago: 0,
  fechaPago: "",
  monto: 0,
  metodoPago: "",
  idFactura: 0,
  nombreCliente: "",
  numeroFacturaHabitacion: "",
};

export function NuevoPago() {
  const [pago, setPago] = useState<IPago>(initialPago);
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Facturas/Lista`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFacturas(data);
          } else {
            Swal.fire(
              "Error",
              "Formato de datos inesperado en las facturas",
              "error"
            );
          }
        } else {
          Swal.fire("Error", "No se pudo obtener las facturas", "error");
        }
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
        Swal.fire("Error", "Hubo un problema al obtener las facturas", "error");
      }
    };

    fetchFacturas();
  }, []);

  const inputChangeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "idFactura") {
      const idFacturaSeleccionada = Number(value);
      const facturaSeleccionada = facturas.find(
        (f) => f.idFactura === idFacturaSeleccionada
      );

      setPago({
        ...pago,
        idFactura: idFacturaSeleccionada,
        monto: facturaSeleccionada ? facturaSeleccionada.total : 0,
      });
    } else {
      setPago({
        ...pago,
        [name]: value,
      });
    }
  };

  const guardar = async () => {
    if (
      pago.idFactura === 0 ||
      !pago.fechaPago ||
      pago.monto <= 0 ||
      !pago.metodoPago.trim()
    ) {
      Swal.fire(
        "Faltan datos",
        "Por favor, complete todos los campos",
        "warning"
      );
      return;
    }

    const pagoData = {
      fechaPago: pago.fechaPago,
      monto: pago.monto,
      metodoPago: pago.metodoPago,
      idFactura: pago.idFactura,
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}Pagos/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoData),
      });

      if (response.ok) {
        Swal.fire("Guardado", "Pago registrado correctamente", "success");
        navigate("/pagos");
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          Swal.fire(
            "Error",
            errorData.mensaje || "No se pudo guardar el pago",
            "error"
          );
        } catch {
          Swal.fire("Error", "Error desconocido: " + errorText, "error");
        }
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire("Error", "Hubo un problema al enviar la solicitud", "error");
    }
  };

  const volver = () => {
    navigate("/pagos");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <Card
            style={{
              borderRadius: "14px",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                  color: "#b71c1c",
                }}
              >
                <FaMoneyCheckAlt size={22} />
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#b71c1c",
                  }}
                >
                  Nuevo Pago
                </h4>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb" }} />
              <Form>
                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>
                    Fecha de Pago
                  </Label>
                  <Input
                    type="date"
                    name="fechaPago"
                    value={pago.fechaPago}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>Monto</Label>
                  <Input
                    type="number"
                    name="monto"
                    value={pago.monto}
                    readOnly
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      color: "#6b7280",
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>
                    Método de Pago
                  </Label>
                  <Input
                    type="text"
                    name="metodoPago"
                    value={pago.metodoPago}
                    onChange={inputChangeValue}
                    placeholder="Ej: Tarjeta, Efectivo"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: "bold", color: "#333" }}>Factura</Label>
                  <Input
                    type="select"
                    name="idFactura"
                    value={pago.idFactura}
                    onChange={inputChangeValue}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#fff",
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
              </Form>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={guardar}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#b71c1c",
                    border: "none",
                    padding: "10px 18px",
                    fontWeight: "600",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaSave /> Guardar
                </Button>
                <Button
                  onClick={volver}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#6b7280",
                    border: "none",
                    padding: "10px 18px",
                    fontWeight: "600",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
