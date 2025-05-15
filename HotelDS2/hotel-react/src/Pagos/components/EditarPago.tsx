import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IPago } from "../Interfaces/IPago";
import type { IFactura } from "../../Facturas/Interfaces/IFactura"; // Asegúrate de tener IFactura para mostrar nombres

const initialPago: IPago = {
    idPago: 0,
    fechaPago: "",
    monto: 0,
    metodoPago: "",
    idFactura: 0,
    nombreCliente: "",
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

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setPago({
            ...pago,
            [name]: name === "idFactura" ? Number(value) : value
        });
    };

    const guardar = async () => {
        const response = await fetch(`${appsettings.apiUrl}Pagos/Editar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pago)
        });

        if (response.ok) {
            Swal.fire("Actualizado", "Pago actualizado correctamente", "success");
            navigate("/pagos"); // Cambiar si tu ruta final es diferente
        } else {
            Swal.fire("Error", "No se pudo editar el pago", "error");
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
                    <h4>Editar Pago</h4>
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
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Método de Pago</Label>
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
                                <option value={0}>Seleccione una factura</option>
                                {facturas.map(factura => (
                                    <option key={factura.idFactura} value={factura.idFactura}>
                                        {factura.nombreCliente} - {factura.idFactura}
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
