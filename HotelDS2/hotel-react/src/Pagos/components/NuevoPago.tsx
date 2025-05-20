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
} from "reactstrap";

const initialPago: IPago = {
    idPago: 0,
    fechaPago: "",
    monto: 0,
    metodoPago: "",
    idFactura: 0,
    nombreCliente: "",
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
                    console.log("Facturas recibidas:", data); // Verificar la respuesta de la API
                    if (Array.isArray(data)) {
                        setFacturas(data); // Asignar los datos a facturas
                    } else {
                        Swal.fire("Error", "Formato de datos inesperado en las facturas", "error");
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

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "idFactura") {
        const idFacturaSeleccionada = Number(value);
        const facturaSeleccionada = facturas.find(f => f.idFactura === idFacturaSeleccionada);

        setPago({
            ...pago,
            idFactura: idFacturaSeleccionada,
            monto: facturaSeleccionada ? facturaSeleccionada.total : 0
        });
    } else {
        setPago({
            ...pago,
            [name]: value
        });
    }
};


    const guardar = async () => {
        // Validación de campos
        if (pago.idFactura === 0 || !pago.fechaPago || pago.monto <= 0 || !pago.metodoPago) {
            Swal.fire("Faltan datos", "Por favor, complete todos los campos", "warning");
            return;
        }

        // Enviar solo lo que espera el backend (PagoDTO)
        const pagoData = {
            fechaPago: pago.fechaPago, // Asegúrate que esté en formato válido
            monto: pago.monto,
            metodoPago: pago.metodoPago,
            idFactura: pago.idFactura
        };

        try {
            const response = await fetch(`${appsettings.apiUrl}Pagos/Nuevo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pagoData),
            });

            if (response.ok) {
                Swal.fire("Guardado", "Pago registrado correctamente", "success");
                navigate("/pagos"); // Navegar a la página principal o donde se desee
            } else {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    Swal.fire("Error", errorData.mensaje || "No se pudo guardar el pago", "error");
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
        navigate("/pagos"); // Navegar a la página principal
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Pago</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Fecha de Pago</Label>
                            <Input 
                                type="date" 
                                name="fechaPago" 
                                value={pago.fechaPago} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Monto</Label>
                            <Input 
                                type="number" 
                                name="monto" 
                                value={pago.monto} 
                                readOnly 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Metodo de Pago</Label>
                            <Input 
                                type="text" 
                                name="metodoPago" 
                                value={pago.metodoPago} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Factura</Label>
                            <Input 
                                type="select" 
                                name="idFactura" 
                                value={pago.idFactura} 
                                onChange={inputChangeValue}
                            >
                                <option value="0">Seleccione una factura</option>
                                {facturas.map((factura) => (
                                    <option key={factura.idFactura} value={factura.idFactura}>
                                        {factura.nombreCliente}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Form>
                    <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                    <Button color="secondary" onClick={volver}>Volver</Button>
                </Col>
            </Row>
        </Container>
    );
}
