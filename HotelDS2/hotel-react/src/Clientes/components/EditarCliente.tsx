import { type ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
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

export function EditarCliente() {
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<ICliente>(initialCliente);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerCliente = async () => {
            const response = await fetch(`${appsettings.apiUrl}Clientes/Obtener/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCliente(data);
            } else {
                Swal.fire("Error", "No se pudo obtener el cliente", "error");
            }
        };

        obtenerCliente();
    }, [id]);

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setCliente({ ...cliente, [inputName]: inputValue });
    };

    const guardar = async () => {
        const response = await fetch(`${appsettings.apiUrl}Clientes/Editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (response.ok) {
            navigate("/clientes");
        } else {
            Swal.fire({
                title: "Error!",
                text: "No se pudo editar el cliente",
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
                    <h4>Editar Cliente</h4>
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
