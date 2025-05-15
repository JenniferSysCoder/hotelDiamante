import { useState, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IEmpleado } from "../Interfaces/IEmpleado";
import type { IHotel } from "../../Hotel/Interfaces/IHotel"; // Si también necesitas la lista de hoteles
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

const initialEmpleado: IEmpleado = {
    idEmpleado: 0,
    nombre: "",
    apellido: "",
    cargo: "",
    telefono: "",
    idHotel: 0
};

export function NuevoEmpleado() {
    const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
    const [hoteles, setHoteles] = useState<IHotel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHoteles = async () => {
            const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
            if (response.ok) {
                const data = await response.json();
                setHoteles(data);
            }
        };
        fetchHoteles();
    }, []);

    const inputChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEmpleado({
            ...empleado,
            [name]: name === "idHotel" ? Number(value) : value
        });
    };

    const guardar = async () => {
    if (!empleado.nombre || !empleado.apellido || !empleado.cargo || !empleado.idHotel) {
        Swal.fire("Faltan datos", "Todos los campos son obligatorios", "warning");
        return;
    }

    const empleadoConHotel = { ...empleado, NombreHotel: hoteles.find(hotel => hotel.idHotel === empleado.idHotel)?.nombre };

    const response = await fetch(`${appsettings.apiUrl}Empleados/Nuevo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleadoConHotel),
    });

    if (response.ok) {
        Swal.fire("Guardado", "Empleado creado correctamente", "success");
        navigate("/empleados");
    } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.mensaje || "No se pudo guardar el empleado", "error");
    }
};


    const volver = () => {
        navigate("/empleados");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Empleado</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="nombre" value={empleado.nombre} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Apellido</Label>
                            <Input type="text" name="apellido" value={empleado.apellido} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Cargo</Label>
                            <Input type="text" name="cargo" value={empleado.cargo} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono</Label>
                            <Input type="text" name="telefono" value={empleado.telefono} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Hotel</Label>
                            <Input 
                                type="select" 
                                name="idHotel" 
                                value={empleado.idHotel} 
                                onChange={inputChangeValue}
                            >
                                <option value="0">Seleccione un hotel</option>
                                {hoteles.map((hotel) => (
                                    <option key={hotel.idHotel} value={hotel.idHotel}>
                                        {hotel.nombre}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <div className="mt-4">
                            <Button color="primary" className="me-3" onClick={guardar}>Guardar</Button>
                            <Button color="secondary" onClick={volver}>Volver</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
