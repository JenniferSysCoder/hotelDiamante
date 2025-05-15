import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { ILimpieza } from "../Interfaces/ILimpieza";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion"; 
import type { IEmpleado } from "../../Empleados/Interfaces/IEmpleado"; 
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

const initialLimpieza: ILimpieza = {
    fecha: "",  // La fecha se manejará como un string
    observaciones: "",
    idHabitacion: 0,
    idEmpleado: 0,
    idLimpieza: 0,
    nombreEmpleado: "",
    numeroHabitacion: ""
};

export function NuevaLimpieza() {
    const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
    const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpleados = async () => {
            const response = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
            if (response.ok) {
                const data = await response.json();
                setEmpleados(data);
            }
        };
        const fetchHabitaciones = async () => {
            const response = await fetch(`${appsettings.apiUrl}Habitaciones/Lista`);
            if (response.ok) {
                const data = await response.json();
                setHabitaciones(data);
            }
        };
        fetchEmpleados();
        fetchHabitaciones();
    }, []);

    const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLimpieza({
            ...limpieza,
            [name]: name === "idHabitacion" || name === "idEmpleado" ? Number(value) : value
        });
    };

    const guardar = async () => {
    if (limpieza.idHabitacion === 0 || limpieza.idEmpleado === 0 || !limpieza.fecha) {
        Swal.fire("Faltan datos", "Por favor, complete todos los campos", "warning");
        return;
    }

    // Buscar el nombre del empleado por su ID
    const empleadoSeleccionado = empleados.find(empleado => empleado.idEmpleado === limpieza.idEmpleado);
    const habitacionSeleccionada = habitaciones.find(habitacion => habitacion.idHabitacion === limpieza.idHabitacion);

    // Crear un objeto con el formato correcto para enviar al backend
    const limpiezaData = {
        Fecha: limpieza.fecha,
        Observaciones: limpieza.observaciones,
        IdEmpleado: limpieza.idEmpleado,
        NombreEmpleado: empleadoSeleccionado?.nombre || "", // Asegúrate de que el campo sea el nombre
        IdHabitacion: limpieza.idHabitacion,
        NumeroHabitacion: habitacionSeleccionada?.numero || "", // Asegúrate de enviar el número de habitación
    };

    try {
        const response = await fetch(`${appsettings.apiUrl}Limpiezas/Nuevo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(limpiezaData),
        });

        if (response.ok) {
            Swal.fire("Guardado", "Limpieza registrada correctamente", "success");
            navigate("/limpiezas");
        } else {
            const errorText = await response.text();
            console.error("Error al guardar:", errorText);

            try {
                const errorData = JSON.parse(errorText);
                Swal.fire("Error", errorData.mensaje || "No se pudo guardar la limpieza", "error");
            } catch (e) {
                Swal.fire("Error", "Error desconocido: " + errorText, "error");
            }
        }
    } catch (error) {
        console.error("Error inesperado:", error);
        Swal.fire("Error", "Hubo un problema al enviar la solicitud", "error");
    }
};

    const volver = () => {
        navigate("/limpiezas");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nueva Limpieza</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Fecha</Label>
                            <Input 
                                type="date" 
                                name="fecha" 
                                value={limpieza.fecha} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Observaciones</Label>
                            <Input 
                                type="text" 
                                name="observaciones" 
                                value={limpieza.observaciones} 
                                onChange={inputChangeValue} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Habitación</Label>
                            <Input 
                                type="select" 
                                name="idHabitacion" 
                                value={limpieza.idHabitacion} 
                                onChange={inputChangeValue}
                            >
                                <option value="0">Seleccione una habitación</option>
                                {habitaciones.map((habitacion) => (
                                    <option key={habitacion.idHabitacion} value={habitacion.idHabitacion}>
                                        {habitacion.numero}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Empleado</Label>
                            <Input 
                                type="select" 
                                name="idEmpleado" 
                                value={limpieza.idEmpleado} 
                                onChange={inputChangeValue}
                            >
                                <option value="0">Seleccione un empleado</option>
                                {empleados.map((empleado) => (
                                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                        {empleado.nombre}
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
