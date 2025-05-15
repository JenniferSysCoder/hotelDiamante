import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../../serviciosAdicionales/Interfaces/IServicio";
import type { IReserva } from "../../Reservas/Interfaces/IReserva";

const initialFactura: IFactura = {
    idFactura: 0,
    fechaEmision: "",
    total: 0,
    idServicio: 0,
    idReserva: 0,
    nombreServicio: "",
    nombreCliente: "",
};

export function EditarFactura() {
    const { id } = useParams<{ id: string }>();
    const [factura, setFactura] = useState<IFactura>(initialFactura);
    const [servicios, setServicios] = useState<IServicio[]>([]);
    const [reservas, setReservas] = useState<IReserva[]>([]);
    const [cargando, setCargando] = useState(true); // Estado de carga
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const [facturaRes, serviciosRes, reservasRes] = await Promise.all([
                    fetch(`${appsettings.apiUrl}Facturas/Obtener/${id}`),
                    fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`),
                    fetch(`${appsettings.apiUrl}Reservas/Lista`),
                ]);
                
                if (!facturaRes.ok || !serviciosRes.ok || !reservasRes.ok) {
                    throw new Error("Hubo un error al obtener los datos");
                }

                const facturaData = await facturaRes.json();
                const serviciosData = await serviciosRes.json();
                const reservasData = await reservasRes.json();

                console.log(serviciosData); // Verifica qué datos trae la API para servicios

                setFactura(facturaData);
                setServicios(serviciosData);
                setReservas(reservasData);
            } catch (error) {
                Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
            } finally {
                setCargando(false); // Se acaba de cargar la información
            }
        };

        obtenerDatos();
    }, [id]);

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFactura({
            ...factura,
            [name]: name === "idServicio" || name === "idReserva" ? Number(value) : value
        });
    };

    const guardar = async () => {
        const response = await fetch(`${appsettings.apiUrl}Facturas/Editar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(factura)
        });

        if (response.ok) {
            Swal.fire("Actualizado", "Factura actualizada correctamente", "success");
            navigate("/facturas");
        } else {
            Swal.fire("Error", "No se pudo editar la factura", "error");
        }
    };

    const volver = () => {
        navigate("/facturas");
    };

    if (cargando) {
        return <div>Cargando...</div>; // Mostrar un indicador de carga mientras se obtiene la información
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Editar Factura</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Fecha de Emisión</Label>
                            <Input 
                                type="date" 
                                name="fechaEmision" 
                                value={factura.fechaEmision} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Total</Label>
                            <Input 
                                type="number" 
                                name="total" 
                                value={factura.total} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Servicio</Label>
                            <Input 
                                type="select" 
                                name="idServicio" 
                                value={factura.idServicio} 
                                onChange={inputChangeValue}
                            >
                                <option value={0}>Seleccione un servicio</option>
                                {servicios.map(servicio => (
                                    <option key={servicio.idServicio} value={servicio.idServicio}>
                                        {servicio.nombre} {/* Ajusté el nombre del campo a nombreServicio */}
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
                            >
                                <option value={0}>Seleccione una reserva</option>
                                {reservas.map(reserva => (
                                    <option key={reserva.idReserva} value={reserva.idReserva}>
                                        {reserva.nombreCliente}
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
