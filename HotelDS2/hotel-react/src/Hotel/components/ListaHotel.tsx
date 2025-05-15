import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IHotel } from "../Interfaces/IHotel";
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

export function ListaHotel() {
    const [hoteles, setHoteles] = useState<IHotel[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const obtenerHoteles = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
            if (response.ok) {
                const data = await response.json();
                setHoteles(data);
            } else {
                console.error("Error al obtener hoteles:", response.statusText);
                Swal.fire("Error", "No se pudo obtener la lista de hoteles", "error");
            }
        } catch (error) {
            console.error("Error de red al obtener hoteles:", error);
            Swal.fire("Error", "Hubo un problema de conexión", "error");
        }
    };

    useEffect(() => {
        obtenerHoteles();
    }, []);

    const Eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Eliminar hotel!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Hoteles/Eliminar/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) await obtenerHoteles();
            }
        });
    };

    // Filtro por nombre
    const hotelesFiltrados = hoteles.filter((hotel) =>
        hotel.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de hoteles</h4>
                    <hr />

                    <Row className="mb-3 align-items-center">
                        <Col md="6">
                           <Link className="btn btn-success" to="nuevohotel">
                            Nuevo Hotel
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
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotelesFiltrados.map((hotel) => (
                                <tr key={hotel.idHotel}>
                                    <td>{hotel.idHotel}</td>
                                    <td>{hotel.nombre}</td>
                                    <td>{hotel.direccion}</td>
                                    <td>{hotel.telefono}</td>
                                    <td>{hotel.correo}</td>
                                    <td>{hotel.categoria}</td>
                                    <td>
                                       <Link
                                        className="btn btn-primary me-2"
                                        to={`editarhotel/${hotel.idHotel}`}
                                        >
                                        Editar
                                        </Link>
                                        <Button
                                            color="danger"
                                            onClick={() => Eliminar(hotel.idHotel!)}
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
