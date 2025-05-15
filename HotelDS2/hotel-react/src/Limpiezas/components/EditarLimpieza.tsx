import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import type { ILimpieza } from "../Interfaces/ILimpieza";
import type { IEmpleado } from "../../Empleados/Interfaces/IEmpleado";
import type { IHabitacion } from "../../Habitaciones/Interfaces/IHabitacion";

const initialLimpieza: ILimpieza = {
    fecha: "",
    observaciones: "",
    idHabitacion: 0,
    idEmpleado: 0,
    idLimpieza: 0,
    nombreEmpleado: "",
    numeroHabitacion: ""
};

export function EditarLimpieza() {
    const { id } = useParams<{ id: string }>();
    const [limpieza, setLimpieza] = useState<ILimpieza>(initialLimpieza);
    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
    const [habitaciones, setHabitaciones] = useState<IHabitacion[]>([]);
    const [cargando, setCargando] = useState(true); // Estado de carga
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const [limpiezaRes, empleadosRes, habitacionesRes] = await Promise.all([
                    fetch(`${appsettings.apiUrl}Limpiezas/Obtener/${id}`),
                    fetch(`${appsettings.apiUrl}Empleados/Lista`),
                    fetch(`${appsettings.apiUrl}Habitaciones/Lista`),
                ]);
                
                if (!limpiezaRes.ok || !empleadosRes.ok || !habitacionesRes.ok) {
                    throw new Error("Hubo un error al obtener los datos");
                }

                const [limpiezaData, empleadosData, habitacionesData] = await Promise.all([
                    limpiezaRes.json(),
                    empleadosRes.json(),
                    habitacionesRes.json(),
                ]);

                setLimpieza(limpiezaData);
                setEmpleados(empleadosData);
                setHabitaciones(habitacionesData);
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
        setLimpieza({
            ...limpieza,
            [name]: name === "idHabitacion" || name === "idEmpleado" ? Number(value) : value
        });
    };

    const guardar = async () => {
        const response = await fetch(`${appsettings.apiUrl}Limpiezas/Editar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(limpieza)
        });

        if (response.ok) {
            Swal.fire("Actualizado", "Limpieza actualizada correctamente", "success");
            navigate("/limpiezas");
        } else {
            Swal.fire("Error", "No se pudo editar la limpieza", "error");
        }
    };

    const volver = () => {
        navigate("/limpiezas");
    };

    if (cargando) {
        return <div>Cargando...</div>; // Mostrar un indicador de carga mientras se obtiene la información
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Editar Limpieza</h4>
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
                                <option value={0}>Seleccione una habitación</option>
                                {habitaciones.map(habitacion => (
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
                                <option value={0}>Seleccione un empleado</option>
                                {empleados.map(empleado => (
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
