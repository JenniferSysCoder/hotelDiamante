import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { ILimpieza } from "../Interfaces/ILimpieza";
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

export function ListaLimpieza() {
    const [limpiezas, setLimpiezas] = useState<ILimpieza[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const obtenerLimpiezas = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Limpiezas/Lista`);
            if (response.ok) {
                const data = await response.json();
                console.log("Datos recibidos de la API:", data); // Verifica los datos que recibes
                if (Array.isArray(data)) {
                    setLimpiezas(data);
                } else {
                    Swal.fire("Error", "Formato de datos inesperado", "error");
                }
            } else {
                console.error("Error al obtener limpiezas:", response.statusText);
                Swal.fire("Error", "No se pudo obtener la lista de limpiezas", "error");
            }
        } catch (error) {
            console.error("Error de red al obtener limpiezas:", error);
            Swal.fire("Error", "Hubo un problema de conexión", "error");
        }
    };

    useEffect(() => {
        obtenerLimpiezas();
    }, []);

    const Eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Eliminar limpieza!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Limpiezas/Eliminar/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    await obtenerLimpiezas();
                    Swal.fire("Eliminado", "La limpieza ha sido eliminada", "success");
                } else {
                    Swal.fire("Error", "No se pudo eliminar la limpieza", "error");
                }
            }
        });
    };

    const limpiezasFiltradas = limpiezas.filter((limpieza) =>
        limpieza.numeroHabitacion.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatearFecha = (fecha: string) => {
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) {
            console.error("Fecha inválida:", fecha);
            return "Fecha inválida";
        }
        return fechaObj.toLocaleDateString();
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Limpiezas</h4>
                    <hr />

                    <Row className="mb-3 align-items-center">
                        <Col md="6">
                            <Link className="btn btn-success" to="nuevalimpieza">
                                Nueva Limpieza
                            </Link>
                        </Col>
                        <Col md="6" className="text-end">
                            <InputGroup style={{ maxWidth: "300px", marginLeft: "auto" }}>
                                <InputGroupText>
                                    <FaSearch />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    placeholder="Buscar por habitación..."
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
                                <th>Fecha</th>
                                <th>Observaciones</th>
                                <th>Habitación</th>
                                <th>Empleado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {limpiezasFiltradas.length > 0 ? (
                                limpiezasFiltradas.map((limpieza) => (
                                    <tr key={limpieza.idLimpieza}>
                                        <td>{limpieza.idLimpieza}</td>
                                        <td>{formatearFecha(limpieza.fecha)}</td>
                                        <td>{limpieza.observaciones}</td>
                                        <td>{limpieza.numeroHabitacion}</td>
                                        <td>{limpieza.nombreEmpleado}</td>
                                        <td>
                                            <Link
                                                className="btn btn-primary me-2"
                                                to={`editarlimpieza/${limpieza.idLimpieza}`}
                                            >
                                                Editar
                                            </Link>
                                            <Button
                                                color="danger"
                                                onClick={() => Eliminar(limpieza.idLimpieza)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        No se encontraron limpiezas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}
