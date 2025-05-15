import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IEmpleado } from "../Interfaces/IEmpleado";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Input,
    InputGroup,
    InputGroupText,
} from "reactstrap";
import { FaSearch } from "react-icons/fa";

export function ListaEmpleado() {
    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const obtenerEmpleados = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
            if (response.ok) {
                const data = await response.json();
                setEmpleados(data);
            } else {
                console.error("Error al obtener empleados:", response.statusText);
                Swal.fire("Error", "No se pudo obtener la lista de empleados", "error");
            }
        } catch (error) {
            console.error("Error de red al obtener empleados:", error);
            Swal.fire("Error", "Hubo un problema de conexión", "error");
        }
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const Eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Eliminar empleado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Empleados/Eliminar/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) await obtenerEmpleados();
            }
        });
    };

    const empleadosFiltrados = empleados.filter((emp) =>
        emp.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de empleados</h4>
                    <hr />

                    <Row className="mb-3 align-items-center">
                        <Col md="6">
                            <Link className="btn btn-success" to="nuevoempleado">
                                Nuevo Empleado
                            </Link>
                        </Col>
                        <Col md="6" className="text-end">
                            <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                                <InputGroupText>
                                    <FaSearch />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Table bordered responsive>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Cargo</th>
                                <th>Hotel</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosFiltrados.map((emp) => (
                                <tr key={emp.idEmpleado}>
                                    <td>{emp.idEmpleado}</td>
                                    <td>{emp.nombre}</td>
                                    <td>{emp.apellido}</td>
                                    <td>{emp.telefono ?? "N/D"}</td>
                                    <td>{emp.cargo}</td>
                                    <td>{emp.nombreHotel ?? "N/D"}</td>
                                    <td>
                                        <Link
                                            className="btn btn-primary me-2"
                                            to={`editarempleado/${emp.idEmpleado}`}
                                        >
                                            Editar
                                        </Link>
                                        <Button
                                            color="danger"
                                            onClick={() => Eliminar(emp.idEmpleado)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}
