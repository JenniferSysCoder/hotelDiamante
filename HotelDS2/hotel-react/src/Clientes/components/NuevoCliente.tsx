import { type ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { ICliente } from "../Interfaces/ICliente";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialCliente: ICliente = {
    idCliente: 0,
    nombre: "",
    apellido: "",
    documento: "",
    correo: "",
    telefono: ""
};

export function NuevoCliente() {
    const [cliente, setCliente] = useState<ICliente>(initialCliente);
    const navigate = useNavigate();

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setCliente({ ...cliente, [inputName]: inputValue });
    };

    const guardar = async () => {
    const response = await fetch(`${appsettings.apiUrl}Clientes/Nuevo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    const data = await response.json(); // Capturamos la respuesta del backend

    if (response.ok) {
        // Si el cliente se guarda exitosamente, redirigir
        navigate("/clientes");
    } else {
        // Si ocurre un error (como documento duplicado), mostrar el mensaje de error
        Swal.fire({
            title: "Error!",
            text: data.mensaje || "No se pudo guardar el cliente",
            icon: "warning"
        });
    }
};


    const volver = () => {
        navigate("/clientes");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Cliente</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="nombre" onChange={inputChangeValue} value={cliente.nombre} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Apellido</Label>
                            <Input type="text" name="apellido" onChange={inputChangeValue} value={cliente.apellido} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Documento</Label>
                            <Input type="text" name="documento" onChange={inputChangeValue} value={cliente.documento} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Correo</Label>
                            <Input type="email" name="correo" onChange={inputChangeValue} value={cliente.correo} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono</Label>
                            <Input type="text" name="telefono" onChange={inputChangeValue} value={cliente.telefono} />
                        </FormGroup>
                    </Form>
                    <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                    <Button color="secondary" onClick={volver}>Volver</Button>
                </Col>
            </Row>
        </Container>
    );
}
