import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { IServicio } from "../Interfaces/IServicio";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialServicio: IServicio = {
    idServicio: 0,
    nombre: "",
    descripcion: "",
    precio: 0
};

export function NuevoServicio() {
    const [servicio, setServicio] = useState<IServicio>(initialServicio);
    const navigate = useNavigate();

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setServicio({ ...servicio, [inputName]: inputValue });
    };

    const guardar = async () => {
        const response = await fetch(`${appsettings.apiUrl}ServiciosAdicionales/Nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicio)
        });

        const data = await response.json(); // Capturamos la respuesta del backend

        if (response.ok) {
            // Si el servicio se guarda exitosamente, redirigir
            navigate("/servicios");
        } else {
            // Si ocurre un error, mostrar el mensaje de error
            Swal.fire({
                title: "Error!",
                text: data.mensaje || "No se pudo guardar el servicio",
                icon: "warning"
            });
        }
    };

    const volver = () => {
        navigate("/servicios");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Servicio</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="nombre" onChange={inputChangeValue} value={servicio.nombre} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descripción</Label>
                            <Input type="text" name="descripcion" onChange={inputChangeValue} value={servicio.descripcion} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Precio</Label>
                            <Input
                                type="number"
                                name="precio"
                                onChange={inputChangeValue}
                                value={servicio.precio}
                                min="0"
                                step="0.01"
                            />
                        </FormGroup>
                    </Form>
                    <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                    <Button color="secondary" onClick={volver}>Volver</Button>
                </Col>
            </Row>
        </Container>
    );
}
