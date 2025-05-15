import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import type { IHabitacion } from "../Interfaces/IHabitacion";
import type { IHotel } from "../../Hotel/Interfaces/IHotel"; 
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



const initialHabitacion: IHabitacion = {
    numero: "",
    tipo: "",
    precioNoche: 0,
    estado: "Disponible",
    idHotel: 0,
    idHabitacion: 0,
    nombreHotel: ""
};

export function NuevaHabitacion() {
    const [habitacion, setHabitacion] = useState<IHabitacion>(initialHabitacion);
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
        setHabitacion({
            ...habitacion,
            [name]: name === "precioNoche" || name === "idHotel" ? Number(value) : value
        });
    };

    const guardar = async () => {
        if (habitacion.idHotel === 0) {
            Swal.fire("Faltan datos", "Seleccione un hotel", "warning");
            return;
        }

        const response = await fetch(`${appsettings.apiUrl}Habitaciones/Nuevo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(habitacion),
        });

        if (response.ok) {
            Swal.fire("Guardado", "Habitación creada correctamente", "success");
            navigate("/habitaciones");
            } else {
                const errorData = await response.json();
                Swal.fire("Error", errorData.mensaje || "No se pudo guardar la habitación", "error");
            }
        };

    const volver = () => {
        navigate("/habitaciones");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nueva Habitación</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Número</Label>
                            <Input type="text" name="numero" value={habitacion.numero} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Tipo</Label>
                            <Input type="text" name="tipo" value={habitacion.tipo} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Precio por noche</Label>
                            <Input type="number" name="precioNoche" value={habitacion.precioNoche} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Estado</Label>
                            <Input type="text" name="estado" value={habitacion.estado} onChange={inputChangeValue} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Hotel</Label>
                            <Input 
                                type="select" 
                                name="idHotel" 
                                value={habitacion.idHotel} 
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

                    </Form>
                    <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                    <Button color="secondary" onClick={volver}>Volver</Button>
                </Col>
            </Row>
        </Container>
    );
}
