import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../../serviciosAdicionales/Interfaces/IServicio";
import type { IReserva } from "../../Reservas/Interfaces/IReserva";
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

const initialFactura: IFactura = {
    idFactura: 0,
    fechaEmision: "",
    total: 0,
    idServicio: 0,
    idReserva: 0,
    nombreServicio: "",
    nombreCliente: "",
};

export function NuevaFactura() {
    const [factura, setFactura] = useState<IFactura>(initialFactura);
    const [servicios, setServicios] = useState<IServicio[]>([]);
    const [reservas, setReservas] = useState<IReserva[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Lista`);
                const data = await response.json();
                if (Array.isArray(data)) setServicios(data);
                else Swal.fire("Error", "Formato de servicios incorrecto", "error");
            } catch (error) {
                console.error("Error servicios:", error);
                Swal.fire("Error", "Error al cargar servicios", "error");
            }
        };

        const fetchReservas = async () => {
            try {
                const response = await fetch(`${appsettings.apiUrl}Reservas/Lista`);
                const data = await response.json();
                if (Array.isArray(data)) setReservas(data);
                else Swal.fire("Error", "Formato de reservas incorrecto", "error");
            } catch (error) {
                console.error("Error reservas:", error);
                Swal.fire("Error", "Error al cargar reservas", "error");
            }
        };

        fetchServicios();
        fetchReservas();
    }, []);

    const calcularTotal = async (idReserva: number, idServicio: number) => {
        if (idReserva > 0 && idServicio > 0) {
            try {
                const response = await fetch(`${appsettings.apiUrl}Facturas/CalcularTotal?idReserva=${idReserva}&idServicio=${idServicio}`);
                if (response.ok) {
                    const data = await response.json();
                    setFactura(prev => ({
                        ...prev,
                        total: data.totalCalculado
                    }));
                } else {
                    Swal.fire("Error", "No se pudo calcular el total", "error");
                }
            } catch (error) {
                console.error("Error al calcular total:", error);
                Swal.fire("Error", "Hubo un problema al calcular el total", "error");
            }
        }
    };

    const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericValue = name === "idServicio" || name === "idReserva" ? Number(value) : value;

        const updatedFactura = {
            ...factura,
            [name]: numericValue,
        };

        setFactura(updatedFactura);

        // Llamar a calcularTotal si ambos campos están completos
        if ((name === "idServicio" && updatedFactura.idReserva > 0) ||
            (name === "idReserva" && updatedFactura.idServicio > 0)) {
            calcularTotal(updatedFactura.idReserva, updatedFactura.idServicio);
        }
    };

    const guardar = async () => {
        if (factura.idServicio === 0 || factura.idReserva === 0 || !factura.fechaEmision) {
            Swal.fire("Faltan datos", "Por favor, complete todos los campos", "warning");
            return;
        }

        const facturaData = {
            fechaEmision: factura.fechaEmision,
            total: factura.total, // Aunque no lo llenes manualmente, se manda al backend
            idServicio: factura.idServicio,
            idReserva: factura.idReserva
        };

        try {
            const response = await fetch(`${appsettings.apiUrl}Facturas/Nueva`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(facturaData),
            });

            if (response.ok) {
                Swal.fire("Guardado", "Factura registrada correctamente", "success");
                navigate("/facturas");
            } else {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    Swal.fire("Error", errorData.mensaje || "No se pudo guardar la factura", "error");
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
        navigate("/facturas");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nueva Factura</h4>
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
                                readOnly
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
                                <option value="0">Seleccione un servicio</option>
                                {servicios.map((servicio) => (
                                    <option key={servicio.idServicio} value={servicio.idServicio}>
                                        {servicio.nombre}
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
                                <option value="0">Seleccione un Cliente</option>
                                {reservas.map((reserva) => (
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
